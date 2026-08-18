const { google } = require('googleapis');
const axios = require('axios');
const { Email } = require('./model');

function getGmailClient() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

// Naye/unread emails fetch karo aur database me save karo
const fetchNewEmails = async (req, res, next) => {
  try {
    const gmail = getGmailClient();
    const companyId = process.env.DEFAULT_COMPANY_ID;

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 5
    });

    const messages = list.data.messages || [];
    const savedEmails = [];

    for (const msg of messages) {
      const exists = await Email.findOne({ gmailMessageId: msg.id });
      if (exists) continue;

      const full = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const headers = full.data.payload.headers;
      const from = headers.find(h => h.name === 'From')?.value || '';
      const to = headers.find(h => h.name === 'To')?.value || '';
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const snippet = full.data.snippet || '';

      const email = await Email.create({
        companyId,
        gmailMessageId: msg.id,
        threadId: full.data.threadId,
        from,
        to,
        subject,
        body: snippet,
        status: 'unread'
      });

      savedEmails.push(email);
    }

    res.status(200).json({
      success: true,
      message: `${savedEmails.length} new emails fetched`,
      data: { emails: savedEmails }
    });
  } catch (error) {
    next(error);
  }
};

// Database se emails list karo
const getEmails = async (req, res, next) => {
  try {
    const emails = await Email.find({ companyId: process.env.DEFAULT_COMPANY_ID })
      .sort({ receivedAt: -1 });

    res.status(200).json({
      success: true,
      data: { emails }
    });
  } catch (error) {
    next(error);
  }
};

// AI se summary generate karo
const summarizeEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const email = await Email.findById(id);

    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: `Summarize this email in 2 lines:\n\n${email.body}` }]
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
    );

    email.aiSummary = groqResponse.data.choices[0].message.content;
    await email.save();

    res.status(200).json({ success: true, data: { email } });
  } catch (error) {
    next(error);
  }
};

// AI se reply generate karo aur Gmail se bhejo
const replyToEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const email = await Email.findById(id);

    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    // Step 1: Groq se reply generate karo
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b',
        messages: [{
          role: 'user',
          content: `Write a short, professional reply to this email. Only give the reply text, no subject line:\n\nFrom: ${email.from}\nSubject: ${email.subject}\nBody: ${email.body}`
        }]
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
    );

    const aiReply = groqResponse.data.choices[0].message.content;

    // Step 2: Gmail se reply bhejo
    const gmail = getGmailClient();

    const fromEmailMatch = email.from.match(/<(.+)>/);
    const toAddress = fromEmailMatch ? fromEmailMatch[1] : email.from;

    const replySubject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;

    const rawMessage = [
      `To: ${toAddress}`,
      `Subject: ${replySubject}`,
      `In-Reply-To: ${email.gmailMessageId}`,
      `References: ${email.gmailMessageId}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      aiReply
    ].join('\n');

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: email.threadId
      }
    });

    // Step 3: Database update karo
    email.aiReply = aiReply;
    email.status = 'replied';
    await email.save();

    res.status(200).json({
      success: true,
      message: 'Reply generated and sent successfully',
      data: { email }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { fetchNewEmails, getEmails, summarizeEmail, replyToEmail };