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
    const companyId = process.env.DEFAULT_COMPANY_ID; // Step 2 me isko set karenge

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

    // Customer ka message save karo
    await Message.create({
      conversationId: conversation._id,
      sender: 'customer',
      text: text,
      sentiment: 'neutral'
    });

    // Groq se AI reply generate karo
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: text }]
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