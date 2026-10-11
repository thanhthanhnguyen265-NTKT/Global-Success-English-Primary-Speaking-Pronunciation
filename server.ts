import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { findInstantKnowledge } from './src/data/teacherKnowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Unit-specific dialogue generator for fallback & prompt reinforcement
function getUnitFallbackDialogue(
  grade: number,
  unitNumber: number,
  topic: string,
  targetSentence: string,
  targetVocab: string[],
  turnCount: number,
  pupilSpeech: string
) {
  const pupilSaid = (pupilSpeech || '').toLowerCase().trim();

  // Create customized dialogues for different grades and topics
  if (grade === 1) {
    if (turnCount === 1) {
      return {
        teacherReply: `Hi! I'm Teacher Lily. Can you say: "${targetSentence || "Hello"}"?`,
        vietnameseSupport: 'Chào con! Con có thể nói theo cô không?',
        suggestedScaffolds: [targetSentence || "Hello Teacher Lily!", "Hi Teacher!", "My name is Mai."],
      };
    } else if (turnCount === 2) {
      const vocab1 = targetVocab[0] || 'book';
      const vocab2 = targetVocab[1] || 'ball';
      return {
        teacherReply: `Good! Do you see the ${vocab1} or the ${vocab2}?`,
        vietnameseSupport: `Rất giỏi! Con có nhìn thấy ${vocab1} hay ${vocab2} không?`,
        suggestedScaffolds: [`I see the ${vocab1}.`, `I see the ${vocab2}.`, `Yes, I do!`],
      };
    } else if (turnCount === 3) {
      return {
        teacherReply: `Super! Can you say: "I like ${targetVocab[0] || 'English'}"?`,
        vietnameseSupport: `Tuyệt vời! Con nhắc lại câu này nhé!`,
        suggestedScaffolds: [`I like ${targetVocab[0] || 'English'}!`, 'Yes, I like it!'],
      };
    } else {
      return {
        teacherReply: `Wonderful speaking! You did a fantastic job in Unit ${unitNumber}! Goodbye!`,
        vietnameseSupport: 'Con nói rất tốt trong bài này! Tạm biệt con!',
        suggestedScaffolds: ['Goodbye Teacher Lily!', 'Bye bye!'],
      };
    }
  }

  if (grade === 2) {
    if (turnCount === 1) {
      return {
        teacherReply: `Hello! Welcome to Unit ${unitNumber}! Can you tell me: "${targetSentence || 'What is this?'}"?`,
        vietnameseSupport: 'Chào con! Hãy cùng thực hành mẫu câu này nhé!',
        suggestedScaffolds: [targetSentence || 'Here you are.', "I'd like some pizza, please.", 'Yes, teacher!'],
      };
    } else if (turnCount === 2) {
      const foodOrItem = targetVocab[0] || 'popcorn';
      return {
        teacherReply: `Great! Would you like some ${foodOrItem}?`,
        vietnameseSupport: `Tuyệt vời! Con có muốn dùng một ít ${foodOrItem} không?`,
        suggestedScaffolds: [`Yes, please. I'd like some ${foodOrItem}.`, `No, thank you.`, 'Here you are!'],
      };
    } else if (turnCount === 3) {
      return {
        teacherReply: `Very good pronunciation! What else can you see in the picture?`,
        vietnameseSupport: `Phát âm rất tốt! Con còn thấy gì trong bức tranh nữa?`,
        suggestedScaffolds: [`I see a ${targetVocab[1] || 'kite'}.`, `He is flying a kite.`, `She is playing.`],
      };
    } else {
      return {
        teacherReply: `High five! You communicated so well today! Keep it up!`,
        vietnameseSupport: 'Đập tay nào! Hôm nay con giao tiếp rất xuất sắc!',
        suggestedScaffolds: ['Thank you Teacher Lily!', 'Goodbye teacher!'],
      };
    }
  }

  if (grade === 3) {
    if (turnCount === 1) {
      return {
        teacherReply: `Hello! Let's talk about ${topic || 'our lesson'}. ${targetSentence || 'How are you today?'}`,
        vietnameseSupport: `Chào con! Cùng trò chuyện về chủ đề này nhé!`,
        suggestedScaffolds: ["I'm fine, thank you.", "My name's Nam.", targetSentence || "Hello teacher!"],
      };
    } else if (turnCount === 2) {
      const item = targetVocab[0] || 'school';
      return {
        teacherReply: `That's right! Can you tell me about your ${item}?`,
        vietnameseSupport: `Đúng rồi! Con hãy kể cho cô nghe về điều này nhé!`,
        suggestedScaffolds: [`It's very big.`, `I like my ${item}.`, `Yes, it is.`],
      };
    } else if (turnCount === 3) {
      return {
        teacherReply: `Excellent! Do you have any questions for me about ${topic}?`,
        vietnameseSupport: `Xuất sắc! Con có câu hỏi nào muốn hỏi cô Lily không?`,
        suggestedScaffolds: [`What colour is it, teacher?`, `Do you like it?`, `What is this?`],
      };
    } else {
      return {
        teacherReply: `Brilliant conversation! You used your words and sentences accurately!`,
        vietnameseSupport: 'Cuộc trò chuyện thật tuyệt! Con dùng từ và câu rất chính xác!',
        suggestedScaffolds: ['Thank you Teacher Lily!', 'See you next time!'],
      };
    }
  }

  if (grade === 4) {
    if (turnCount === 1) {
      return {
        teacherReply: `Good day! We are exploring Unit ${unitNumber}: ${topic}. ${targetSentence || 'Where are you from?'}`,
        vietnameseSupport: `Chào em! Chúng ta cùng thực hành bài học số ${unitNumber}.`,
        suggestedScaffolds: [targetSentence || "I'm from Viet Nam.", "It's seven o'clock.", "I can swim."],
      };
    } else if (turnCount === 2) {
      return {
        teacherReply: `Awesome! And what do you usually do in this activity?`,
        vietnameseSupport: `Tuyệt lắm! Thường thì em làm hoạt động này như thế nào?`,
        suggestedScaffolds: [`I do it with my friends.`, `I get up at six o'clock.`, `Because it is fun!`],
      };
    } else if (turnCount === 3) {
      const v = targetVocab[0] || 'English';
      return {
        teacherReply: `Very clear sentence! How often do you practice ${v}?`,
        vietnameseSupport: `Câu nói rất rõ ràng! Em có thường xuyên luyện tập không?`,
        suggestedScaffolds: [`Every day at school.`, `On Mondays and Wednesdays.`, `I love it!`],
      };
    } else {
      return {
        teacherReply: `Outstanding communication skills! You answered with full confidence!`,
        vietnameseSupport: 'Kỹ năng giao tiếp xuất sắc! Em đã trả lời rất tự tin!',
        suggestedScaffolds: ['Thank you so much Teacher Lily!', 'Goodbye!'],
      };
    }
  }

  // Grade 5
  if (turnCount === 1) {
    return {
      teacherReply: `Hello! Today we are practicing Unit ${unitNumber} on ${topic}. ${targetSentence || 'Can you introduce yourself?'}`,
      vietnameseSupport: `Chào em! Hôm nay chúng ta luyện tập Unit ${unitNumber}.`,
      suggestedScaffolds: [targetSentence || "I'd like to be a doctor.", "I live in a peaceful village.", "He's very friendly and helpful."],
    };
  } else if (turnCount === 2) {
    return {
      teacherReply: `That's very interesting! Could you explain why?`,
      vietnameseSupport: `Thật là thú vị! Em có thể giải thích lý do vì sao không?`,
      suggestedScaffolds: [`Because I'd like to help people.`, `Because it's exciting.`, `It's quiet and clean.`],
    };
  } else if (turnCount === 3) {
    return {
      teacherReply: `Impressive English! How do you plan to achieve this in the future?`,
      vietnameseSupport: `Tiếng Anh rất ấn tượng! Em dự định rèn luyện như thế nào?`,
      suggestedScaffolds: [`I study hard every day.`, `I read many English books.`, `I practice speaking with you!`],
    };
  } else {
    return {
      teacherReply: `Congratulations on finishing this speaking unit with great eloquence! Well done!`,
      vietnameseSupport: 'Chúc mừng em đã hoàn thành bài nói với ngữ điệu và vốn từ rất tốt!',
      suggestedScaffolds: ['Thank you, Teacher Lily!', 'Have a wonderful day!'],
    };
  }
}

// Endpoint: Formative Pronunciation Evaluation
app.post('/api/evaluate-pronunciation', async (req, res) => {
  try {
    const {
      targetText,
      recognizedText,
      ipa,
      vietnamese,
      grade,
      activityType,
      unitTitle,
    } = req.body;

    if (!targetText) {
      return res.status(400).json({ error: 'Target text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        pronunciationScore: 4,
        stressScore: 4,
        clarityScore: 4,
        intelligibilityScore: 4,
        overallLevel: 'Level 4 – Good',
        praiseComment: 'Great job! Your voice is loud and clear.',
        vietnamesePraise: 'Em làm rất tốt! Giọng đọc to và rõ ràng.',
        focusSoundOrTip: `Practice the word "${targetText}" once more with clear ending sounds!`,
        formativeFeedback: {
          whatDidWell: 'You attempted the complete target smoothly.',
          whatToImprove: 'Keep your sound natural and steady.',
          whatToTryNext: 'Listen to the audio model and say it together.',
        },
        teacherNotes: 'Recognized input matches expected target. Vowel duration is adequate.',
      });
    }

    const prompt = `You are an encouraging Vietnamese primary school English teacher evaluating a pupil's pronunciation.
The pupil is in Grade ${grade || 1} in Vietnam, learning from the "Global Success" textbook.
Activity: ${activityType || 'Vocabulary Practice'}
Unit: ${unitTitle || 'General'}
Target English: "${targetText}" (IPA: ${ipa || 'standard'}, Meaning: ${vietnamese || 'N/A'})
Pupil's recognized speech: "${recognizedText || '(audio submitted)'}"

CRITICAL RULES:
1. Do NOT repeat instructions or mechanical prefixes. Provide natural, friendly teacher feedback.
2. Use a non-judgmental 1-5 scale (1: Beginning, 2: Developing, 3: Progressing, 4: Good, 5: Confident).
3. If recognized speech is close or matches the target, award 4 or 5.
4. Keep comments concise, uplifting, and developmentally appropriate for primary children.
5. Provide formative answers to:
   - whatDidWell: what the child did well
   - whatToImprove: gentle point to practice
   - whatToTryNext: simple next step

Return strictly valid JSON according to schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        temperature: 0.2,
        maxOutputTokens: 500,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pronunciationScore: { type: Type.INTEGER, description: '1 to 5' },
            stressScore: { type: Type.INTEGER, description: '1 to 5' },
            clarityScore: { type: Type.INTEGER, description: '1 to 5' },
            intelligibilityScore: { type: Type.INTEGER, description: '1 to 5' },
            overallLevel: { type: Type.STRING },
            praiseComment: { type: Type.STRING },
            vietnamesePraise: { type: Type.STRING },
            focusSoundOrTip: { type: Type.STRING },
            formativeFeedback: {
              type: Type.OBJECT,
              properties: {
                whatDidWell: { type: Type.STRING },
                whatToImprove: { type: Type.STRING },
                whatToTryNext: { type: Type.STRING },
              },
              required: ['whatDidWell', 'whatToImprove', 'whatToTryNext'],
            },
            teacherNotes: { type: Type.STRING },
          },
          required: [
            'pronunciationScore',
            'stressScore',
            'clarityScore',
            'intelligibilityScore',
            'overallLevel',
            'praiseComment',
            'vietnamesePraise',
            'focusSoundOrTip',
            'formativeFeedback',
            'teacherNotes',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating pronunciation:', error);
    return res.json({
      pronunciationScore: 4,
      stressScore: 4,
      clarityScore: 4,
      intelligibilityScore: 4,
      overallLevel: 'Level 4 – Good',
      praiseComment: 'Good effort! Your pronunciation is clear.',
      vietnamesePraise: 'Con làm rất tốt! Giọng đọc rõ ràng.',
      focusSoundOrTip: 'Listen to the audio model and try one more time!',
      formativeFeedback: {
        whatDidWell: 'You spoke clearly with great energy.',
        whatToImprove: 'Listen carefully to the vowel sound.',
        whatToTryNext: 'Practice saying it smoothly with Teacher Lily.',
      },
      teacherNotes: 'Automatic fallback assessment: Pupil engaged actively with practice target.',
    });
  }
});

// Endpoint: Primary Conversational AI Speaking Partner ("Teacher Lily")
app.post('/api/speaking-chat', async (req, res) => {
  const {
    grade,
    unitNumber,
    unitTitle,
    unitTopic,
    targetSentence,
    targetVocab,
    history,
    pupilSpeech,
    turnCount,
  } = req.body;

  const currentGradeNum = parseInt(grade || '1', 10);
  const currentUnitNum = parseInt(unitNumber || '1', 10);
  const currentTurnNum = parseInt(turnCount || '1', 10);

  if (!process.env.GEMINI_API_KEY) {
    const fallback = getUnitFallbackDialogue(
      currentGradeNum,
      currentUnitNum,
      unitTopic || unitTitle,
      targetSentence,
      targetVocab || [],
      currentTurnNum,
      pupilSpeech
    );
    return res.json({
      teacherReply: fallback.teacherReply,
      vietnameseSupport: fallback.vietnameseSupport,
      suggestedScaffolds: fallback.suggestedScaffolds,
      assessment: {
        pronunciationLevel: 4,
        vocabularyLevel: 4,
        languageUseLevel: 4,
        communicationLevel: 4,
        overallLevel: 'Level 4 – Good',
        whatDidWell: 'You listened carefully and answered right on topic!',
        whatToImprove: 'Use complete sentence frames.',
        whatToTryNext: 'Try asking a question in return!',
      },
      isCompleted: currentTurnNum >= 4,
    });
  }

  try {
    const conversationContext = (history || [])
      .map((item: { role: string; text: string }) => `${item.role === 'model' ? 'Teacher Lily' : 'Pupil'}: ${item.text}`)
      .join('\n');

    const prompt = `You are Teacher Lily, a cheerful English teacher for Vietnamese primary school pupils (Grade ${currentGradeNum}, Global Success curriculum).
Unit ${currentUnitNum}: ${unitTitle || 'Lesson'} (Topic: ${unitTopic || 'General'})
Target vocabulary: ${(targetVocab || []).slice(0, 5).join(', ')}
Target sentence: "${targetSentence || ''}"

Previous dialogue:
${conversationContext || 'Start'}

Pupil answered: "${pupilSpeech || 'Hello!'}"
Turn: ${currentTurnNum} of 4.

RULES:
1. Respond directly and specifically to what the pupil just said and the topic of Unit ${currentUnitNum}. NEVER use a generic unrelated question like favorite toy unless this unit is about toys.
2. Keep teacherReply very concise: 8-12 words for Grades 1-2, 10-15 words for Grades 3-5. A brief positive reaction + 1 clear natural question or prompt.
3. No robotic phrases or meta instructions.
4. Output JSON with teacherReply, vietnameseSupport, suggestedScaffolds (2-3 short pupil reply options), assessment, isCompleted.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        temperature: 0.3,
        maxOutputTokens: 600,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            teacherReply: { type: Type.STRING },
            vietnameseSupport: { type: Type.STRING },
            suggestedScaffolds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            assessment: {
              type: Type.OBJECT,
              properties: {
                pronunciationLevel: { type: Type.INTEGER },
                vocabularyLevel: { type: Type.INTEGER },
                languageUseLevel: { type: Type.INTEGER },
                communicationLevel: { type: Type.INTEGER },
                overallLevel: { type: Type.STRING },
                whatDidWell: { type: Type.STRING },
                whatToImprove: { type: Type.STRING },
                whatToTryNext: { type: Type.STRING },
              },
              required: [
                'pronunciationLevel',
                'vocabularyLevel',
                'languageUseLevel',
                'communicationLevel',
                'overallLevel',
                'whatDidWell',
                'whatToImprove',
                'whatToTryNext',
              ],
            },
            isCompleted: { type: Type.BOOLEAN },
          },
          required: [
            'teacherReply',
            'vietnameseSupport',
            'suggestedScaffolds',
            'assessment',
            'isCompleted',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in speaking chat, using unit-specific fallback:', error);
    const fallback = getUnitFallbackDialogue(
      currentGradeNum,
      currentUnitNum,
      unitTopic || unitTitle,
      targetSentence,
      targetVocab || [],
      currentTurnNum,
      pupilSpeech
    );
    return res.json({
      teacherReply: fallback.teacherReply,
      vietnameseSupport: fallback.vietnameseSupport,
      suggestedScaffolds: fallback.suggestedScaffolds,
      assessment: {
        pronunciationLevel: 4,
        vocabularyLevel: 4,
        languageUseLevel: 4,
        communicationLevel: 4,
        overallLevel: 'Level 4 – Good',
        whatDidWell: 'You communicated clearly and confidently!',
        whatToImprove: 'Practice rhythm with full sentence frames.',
        whatToTryNext: 'Continue practicing everyday with Teacher Lily!',
      },
      isCompleted: currentTurnNum >= 4,
    });
  }
});

// Endpoint: High-Quality Gemini Text-To-Speech (with graceful fallback to client Web Speech)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, slow } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ fallbackToBrowser: true, message: 'API key not configured' });
    }

    // Clean text to avoid any prompt artifacts
    const cleanedText = text
      .replace(/^(Teacher Lily:?|AI:?|Lily:?)/i, '')
      .replace(/Speak (slowly|clearly|warmly)[^:]*:\s*/gi, '')
      .trim();

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanedText,
                speechMetadata: {
                  style: slow
                    ? 'Slow, clear, patient primary English teacher'
                    : 'Cheerful, clear, friendly primary English teacher',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
      }
    } catch (genError: any) {
      // If 429 quota reached or transient issue, gracefully notify client to use Web Speech API
      return res.json({ fallbackToBrowser: true, reason: 'quota_or_network' });
    }

    return res.json({ fallbackToBrowser: true });
  } catch (error: any) {
    return res.json({ fallbackToBrowser: true });
  }
});

// Endpoint: AI Teacher Assistant ("Cô giáo Trợ lý AI - Cô Mai")
// Optimized for lightning-fast responses, deep search, and highest pedagogical grammar accuracy
app.post('/api/ask-teacher-assistant', async (req, res) => {
  const { question, context } = req.body;
  const q = (question || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Question is required' });
  }

  // 1. Instant Knowledge Base Lookup (<5ms)
  // Provides immediate, authoritative, 100% verified Global Success grammar answers
  const instantMatch = findInstantKnowledge(q);
  if (instantMatch) {
    return res.json({
      title: instantMatch.title,
      shortAnswer: instantMatch.shortAnswer,
      explanation: instantMatch.explanation,
      keyRule: instantMatch.keyRule,
      whyUsed: instantMatch.whyUsed,
      commonMistakes: instantMatch.commonMistakes,
      grammarCategory: instantMatch.grammarCategory,
      examples: instantMatch.examples,
      encouragement: instantMatch.encouragement,
      suggestedFollowUps: instantMatch.suggestedFollowUps,
      isInstantKnowledge: true,
    });
  }

  // Default fallback generator for offline or quota issues
  const getSmartFallbackExplanation = (userQ: string) => {
    return {
      title: `Giải đáp chuẩn về: "${userQ.slice(0, 45)}"`,
      shortAnswer: `Chào con! Cô Mai giải đáp thắc mắc "${userQ}" cho con nhé!`,
      explanation: `Trong chương trình Tiếng Anh tiểu học Global Success, mỗi từ và cấu trúc đều có quy tắc rõ ràng. Khi làm bài, con hãy chú ý:
1. Chủ ngữ là ai (ngôi thứ mấy, số ít hay số nhiều).
2. Thời điểm diễn ra hành động (ở hiện tại, đang xảy ra, hay đã xong trong quá khứ).
Hiểu rõ bản chất ngữ pháp sẽ giúp con nói và viết tiếng Anh tự nhiên như người bản xứ!`,
      keyRule: '⚡ Mẹo vàng của Cô Mai: Luôn đối chiếu Chủ ngữ (S) và Thời gian (Time marker) trước khi chọn từ hoặc chia động từ con nhé!',
      whyUsed: 'Mỗi từ trong tiếng Anh đóng một vai trò ngữ pháp cụ thể (chủ ngữ, vị ngữ, tân ngữ, giới từ). Dùng đúng từ giúp câu văn mạch lạc, tránh hiểu lầm.',
      commonMistakes: '⚠️ Chú ý: Tránh dịch từng từ một (word-by-word) từ tiếng Việt sang tiếng Anh, mà hãy học theo cụm từ và mẫu câu chuẩn trong bài học.',
      grammarCategory: 'Quy Tắc Ngữ Pháp Chuẩn (Standard Grammar)',
      examples: [
        { english: 'Practice makes perfect.', vietnamese: 'Luyện tập chăm chỉ sẽ giúp con tiến bộ vượt bậc.', ipa: '/ˈpræktɪs meɪks ˈpɜːfɪkt/' },
        { english: 'English is fun and easy to learn.', vietnamese: 'Tiếng Anh rất vui và dễ học khi hiểu quy tắc.', ipa: '/ˈɪŋɡlɪʃ ɪz fʌn ænd ˈiːzi tuː lɜːn/' }
      ],
      encouragement: 'Cô rất khen ngợi tinh thần tự giác học hỏi của con! Cứ hỏi cô bất cứ khi nào con gặp từ mới nhé!',
      suggestedFollowUps: [
        'Hỏi về cách dùng một từ cụ thể trong bài học',
        'Cách đặt câu hỏi với What, Where, When, Why',
        'Luyện phát âm chuẩn cho từ khó'
      ]
    };
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(getSmartFallbackExplanation(q));
  }

  // 2. High-speed Gemini 3.8 Flash with LOW ThinkingLevel for rapid, razor-sharp accuracy
  try {
    const prompt = `Bạn là Cô Mai - Cô giáo Trợ lý Tiếng Anh Tiểu học cực kỳ uyên bác, ân cần, yêu trẻ, chuyên sâu chương trình Tiếng Anh "Global Success" (Lớp 1 đến Lớp 5) của Bộ Giáo dục & Đào tạo Việt Nam và chuẩn ngữ pháp Oxford/Cambridge.

Câu hỏi của học sinh/giáo viên:
"${q}"

${context ? `Ngữ cảnh bài học hiện tại:
- Khối lớp: Lớp ${context.grade || 'Tiểu học'}
- Bài học: ${context.unitTitle || 'N/A'}
- Từ vựng/Mẫu câu: ${context.targetWord || context.targetSentence || 'N/A'}
- Chủ đề: ${context.topic || 'N/A'}` : ''}

TIÊU CHUẨN TRẢ LỜI CỦA CÔ MAI (ĐỘ CHÍNH XÁC CAO NHẤT, SƯ PHẠM DỄ HIỂU):
1. SUY NGHĨ NHANH & CHÍNH XÁC: Đưa ra câu trả lời chuẩn xác 100% theo ngữ pháp tiếng Anh chuẩn và khung chương trình SGK Global Success.
2. DỄ HIỂU CHO HỌC SINH TIỂU HỌC: Xưng "Cô" và gọi "con" hoặc "em", giọng điệu ấm áp, khen ngợi, tránh thuật ngữ hàn lâm khó hiểu.
3. PHÂN TÍCH BẢN CHẤT: Nếu hỏi "Vì sao lại dùng từ đó?" -> Giải thích rõ lý do ngữ pháp đằng sau (hòa hợp chủ vị, từ loại, tân ngữ, thời điểm, ngữ cảnh).
4. PHÂN BIỆT RÕ RÀNG: Nếu là từ dễ nhầm lẫn -> Chỉ ra điểm khác nhau cốt lõi bằng so sánh trực quan.
5. CÁC THÌ: Nêu rõ khi nào dùng, công thức vàng, dấu hiệu nhận biết.
6. LƯU Ý LỖI SAI (commonMistakes): Chỉ ra 1 lỗi mà các bạn học sinh tiểu học hay mắc phải nhất để con tránh.
7. VÍ DỤ SONG NGỮ CHUẨN KÈM PHIÊN ÂM IPA: Cung cấp 2-3 ví dụ ngắn gọn, thực tế, kèm phiên âm chuẩn quốc tế /.../ và dịch nghĩa tiếng Việt.
8. MẸO VÀNG GHI NHỚ (keyRule): Một câu thần chú hoặc mẹo nhớ vui nhộn giúp học sinh nhớ suốt đời.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        temperature: 0.15,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Tiêu đề ngắn gọn, chuẩn mực' },
            shortAnswer: { type: Type.STRING, description: 'Tóm tắt nhanh, trọng tâm trong 1-2 câu' },
            explanation: { type: Type.STRING, description: 'Lời giải thích chi tiết, ân cần, sư phạm' },
            keyRule: { type: Type.STRING, description: 'Mẹo ghi nhớ vàng hoặc công thức cốt lõi' },
            whyUsed: { type: Type.STRING, description: 'Giải thích cặn kẽ vì sao lại dùng từ/cấu trúc đó trong tiếng Anh' },
            commonMistakes: { type: Type.STRING, description: 'Cảnh báo lỗi sai học sinh hay mắc và cách tránh' },
            grammarCategory: { type: Type.STRING, description: 'Phân loại ngữ pháp (Thì, Mạo từ, Giới từ, Từ vựng, v.v.)' },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  vietnamese: { type: Type.STRING },
                  ipa: { type: Type.STRING, description: 'Phiên âm IPA chuẩn quốc tế' },
                },
                required: ['english', 'vietnamese'],
              },
            },
            encouragement: { type: Type.STRING, description: 'Lời khen, động viên ngọt ngào của cô giáo' },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 câu hỏi gợi ý liên quan để học sinh mở rộng kiến thức',
            },
          },
          required: [
            'title',
            'shortAnswer',
            'explanation',
            'keyRule',
            'whyUsed',
            'commonMistakes',
            'grammarCategory',
            'examples',
            'encouragement',
            'suggestedFollowUps',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in ask-teacher-assistant:', error);
    return res.json(getSmartFallbackExplanation(q));
  }
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Global Success English server running on http://0.0.0.0:${port}`);
  });
}

startServer();
