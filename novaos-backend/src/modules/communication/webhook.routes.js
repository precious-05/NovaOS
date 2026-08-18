const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Conversation, Message } = require('./model');

// Meta verification (GET)
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Incoming WhatsApp messages (POST)
router.post('/', async (req, res) => {
  console.log('Webhook POST received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message || !message.text) {
      console.log('No text message found in this payload, skipping.');
      return;
    }

    const from = message.from;
    const text = message.text.body;
    const companyId = process.env.DEFAULT_COMPANY_ID;

    console.log(`Message from ${from}: ${text}`);

    // Conversation dhoondo ya nayi banao
    let conversation = await Conversation.findOne({ customerId: from, channel: 'whatsapp' });
    if (!conversation) {
      conversation = await Conversation.create({
        companyId,
        customerId: from,
        channel: 'whatsapp',
        status: 'open',
        lastMessageAt: new Date()
      });
    }

    // Step 1: Intent aur sentiment detect karo
    let intent = 'unknown';
    let sentiment = 'neutral';
    try {
      const analysisResponse = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: 'Analyze the customer message and respond ONLY with valid JSON in this exact format: {"intent": "one of: inquiry, complaint, order, support, greeting, other", "sentiment": "one of: positive, neutral, negative"}. No other text.'
            },
            { role: 'user', content: text }
          ]
        },
        { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
      );

      const analysisText = analysisResponse.data.choices[0].message.content;
      const parsed = JSON.parse(analysisText.match(/\{[\s\S]*\}/)[0]);
      intent = parsed.intent || 'unknown';
      sentiment = parsed.sentiment || 'neutral';
    } catch (analysisError) {
      console.log('Intent/sentiment analysis failed, using defaults:', analysisError.message);
    }

    // Customer ka message save karo (intent aur sentiment ke sath)
    await Message.create({
      conversationId: conversation._id,
      sender: 'customer',
      text: text,
      intent: intent,
      sentiment: sentiment
    });

    // Step 2: Groq se AI reply generate karo (business-specific system prompt ke sath)
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: 'You are the AI customer support assistant for NovaOS, an AI-powered business operating system. Reply to customer WhatsApp messages in a friendly, professional, and concise manner (2-3 sentences max). If you don\'t know something specific about pricing or features, tell the customer a team member will follow up.'
          },
          { role: 'user', content: text }
        ]
      },
      { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
    );

    const aiReply = groqResponse.data.choices[0].message.content;
    console.log('AI reply:', aiReply);

    // AI ka reply bhi save karo
    await Message.create({
      conversationId: conversation._id,
      sender: 'ai',
      text: aiReply
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    // WhatsApp pe reply wapas bhejo
    await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: aiReply }
      },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` } }
    );

    console.log('Reply sent to WhatsApp and saved to database successfully.');
  } catch (error) {
    console.error('Webhook error:', error.response?.data || error.message);
  }
});

module.exports = router;