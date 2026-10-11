export interface KnowledgeTopic {
  id: string;
  category: 'all' | 'tenses' | 'why' | 'compare' | 'curriculum';
  categoryLabel: string;
  keywords: string[];
  title: string;
  shortAnswer: string;
  explanation: string;
  keyRule: string;
  whyUsed: string;
  commonMistakes: string;
  grammarCategory: string;
  examples: Array<{
    english: string;
    vietnamese: string;
    ipa?: string;
  }>;
  encouragement: string;
  suggestedFollowUps: string[];
}

export const TEACHER_KNOWLEDGE_BASE: KnowledgeTopic[] = [
  {
    id: 'present-continuous',
    category: 'tenses',
    categoryLabel: '⏰ Các thì tiếng Anh',
    keywords: ['hiện tại tiếp diễn', 'present continuous', 'am is are', 'v-ing', 'đang làm', 'now', 'at the moment', 'swimming', 'running'],
    title: 'Thì Hiện tại tiếp diễn (Present Continuous)',
    shortAnswer: 'Thì Hiện tại tiếp diễn dùng để diễn tả hành động ĐANG DIỄN RA ngay lúc con đang nói chuyện.',
    explanation: 'Con hãy tưởng tượng như mình đang nhìn thấy hành động đó ngay trước mắt: "Nam đang đọc sách", "Các bạn đang chơi đá bóng".\n\nCấu trúc câu:\n• Khẳng định: Chủ ngữ + am / is / are + V-ing\n• Phủ định: Chủ ngữ + am / is / are + not + V-ing\n• Câu hỏi: Am / Is / Are + Chủ ngữ + V-ing?',
    keyRule: '⚡ Công thức vàng: S + be (am/is/are) + V-ing! Nhớ chia đúng be: I đi với am; He/She/It/danh từ số ít đi với is; You/We/They/danh từ số nhiều đi với are.',
    whyUsed: 'Người bản xứ dùng thì này vì hành động chưa kết thúc, đang chuyển động ngay trước mắt. Luôn đi kèm các từ nhận biết như now (bây giờ), right now, at the moment, Look! (Nhìn kìa!), Listen! (Hãy nghe kìa!).',
    commonMistakes: '⚠️ Lỗi hay gặp: Quên động từ to be (nói "I reading" là sai, phải là "I am reading" mới đúng) hoặc quên gấp đôi phụ âm khi thêm -ing (swim -> swimming, run -> running, sit -> sitting).',
    grammarCategory: 'Thì Động Từ (Verb Tense)',
    examples: [
      {
        english: 'I am reading an English comic book now.',
        vietnamese: 'Mình đang đọc một cuốn truyện tranh tiếng Anh bây giờ.',
        ipa: '/aɪ æm ˈriːdɪŋ ən ˈɪŋɡlɪʃ ˈkɒmɪk bʊk naʊ/'
      },
      {
        english: 'Look! The boys are playing football in the schoolyard.',
        vietnamese: 'Nhìn kìa! Các bạn nam đang chơi bóng đá trong sân trường.',
        ipa: '/lʊk! ðə bɔɪz ɑːr ˈpleɪɪŋ ˈfʊtbɔːl ɪn ðə ˈskuːljɑːd/'
      },
      {
        english: 'She is listening to music in her bedroom.',
        vietnamese: 'Bạn ấy đang nghe nhạc trong phòng ngủ của mình.',
        ipa: '/ʃiː ɪz ˈlɪsnɪŋ tuː ˈmjuːzɪk ɪn hɜːr ˈbedruːm/'
      }
    ],
    encouragement: 'Con nắm thì tiếp diễn rất tốt! Hãy thử nhìn quanh phòng và đặt 1 câu xem ai đang làm gì nhé!',
    suggestedFollowUps: [
      'Vì sao động từ swim lại thành swimming (gấp đôi m)?',
      'Phân biệt thì Hiện tại đơn và Hiện tại tiếp diễn',
      'Quy tắc bỏ chữ e khi thêm -ing như write -> writing'
    ]
  },
  {
    id: 'present-simple',
    category: 'tenses',
    categoryLabel: '⏰ Các thì tiếng Anh',
    keywords: ['hiện tại đơn', 'present simple', 'thêm s', 'thêm es', 'likes', 'goes', 'does', 'thói quen', 'sự thật'],
    title: 'Thì Hiện tại đơn & Quy tắc thêm -s / -es',
    shortAnswer: 'Thì Hiện tại đơn dùng để nói về thói quen hàng ngày, sở thích hoặc một sự thật hiển nhiên luôn đúng.',
    explanation: 'Khi chủ ngữ là ngôi thứ 3 số ít như He (anh ấy), She (cô ấy), It (nó) hoặc 1 người/1 vật (Nam, my mother, the cat), động từ bắt buộc phải thêm đuôi -s hoặc -es để hòa hợp chủ vị.\n\nNếu chủ ngữ là I, You, We, They thì giữ nguyên động từ không thêm gì cả.',
    keyRule: '⚡ Mẹo vàng nhớ đuôi -es: Động từ kết thúc bằng O, S, CH, X, SH, Z (Mẹo: "Ông Sáu Chạy Xe Sh Zui") thì thêm -es (watches, washes, goes, fixes, misses). Còn lại con chỉ cần thêm -s (likes, plays, reads).',
    whyUsed: 'Trong ngữ pháp tiếng Anh, chủ ngữ số ít cần đi với động từ số ít (có đuôi -s/-es). Điều này giúp người nghe phân biệt rõ một người làm hay nhiều người làm.',
    commonMistakes: '⚠️ Lỗi hay gặp: Quên thêm -s khi nói về He/She ("He like apples" là sai, phải là "He likes apples"). Và khi đã dùng trợ động từ "does/doesn\'t", động từ chính phải về nguyên thể ("He doesn\'t like", không nói "doesn\'t likes").',
    grammarCategory: 'Thì Động Từ (Verb Tense)',
    examples: [
      {
        english: 'I get up at six o’clock every morning.',
        vietnamese: 'Mình thức dậy lúc 6 giờ mỗi buổi sáng (thói quen của I).',
        ipa: '/aɪ ɡet ʌp æt sɪks əˈklɒk ˈevri ˈmɔːnɪŋ/'
      },
      {
        english: 'She watches cartoons on Sunday afternoons.',
        vietnamese: 'Bạn ấy xem phim hoạt hình vào các buổi chiều Chủ nhật (thêm -es vì đuôi CH).',
        ipa: '/ʃiː ˈwɒtʃɪz kɑːˈtuːnz ɒn ˈsʌndeɪ ˌɑːftəˈnuːnz/'
      },
      {
        english: 'Nam likes reading books in the library.',
        vietnamese: 'Nam thích đọc sách ở thư viện (thêm -s vì chủ ngữ là Nam).',
        ipa: '/nɑːm laɪks ˈriːdɪŋ bʊks ɪn ðə ˈlaɪbrəri/'
      }
    ],
    encouragement: 'Tuyệt vời lắm! Con chỉ cần nhớ mẹo "Ông Sáu Chạy Xe Sh Zui" là tự tin làm bài đúng 100%!',
    suggestedFollowUps: [
      'Khi nào dùng Do và khi nào dùng Does?',
      'Cách phát âm đuôi -s và -es chuẩn /s/, /z/, /ɪz/',
      'Thì quá khứ đơn khác gì thì hiện tại đơn?'
    ]
  },
  {
    id: 'past-simple',
    category: 'tenses',
    categoryLabel: '⏰ Các thì tiếng Anh',
    keywords: ['quá khứ đơn', 'past simple', 'v-ed', 'yesterday', 'last week', 'went', 'had', 'was', 'were', 'did'],
    title: 'Thì Quá khứ đơn (Past Simple)',
    shortAnswer: 'Thì Quá khứ đơn dùng để kể về một hành động ĐÃ XẢY RA VÀ ĐÃ KẾT THÚC trong quá khứ.',
    explanation: 'Dấu hiệu nhận biết thì này gồm: yesterday (hôm qua), last night / last week / last year (tối qua/tuần trước/năm ngoái), ago (cách đây: two days ago).\n\nCấu trúc:\n• Với To Be: I/He/She/It đi với WAS. You/We/They đi với WERE.\n• Với Động từ thường: Thêm đuôi -ed (play -> played, visit -> visited). Nhưng có một số từ "bất quy tắc" đổi dạng như: go -> went, have -> had, see -> saw, eat -> ate.',
    keyRule: '⚡ Công thức vàng: S + V-ed / V2! Trong câu phủ định và câu hỏi, mượn trợ động từ DID và động từ chính trở về nguyên thể (S + didn’t + V nguyên thể).',
    whyUsed: 'Dùng thì quá khứ giúp người nghe biết câu chuyện con đang kể đã xảy ra rồi, không còn diễn ra ở hiện tại nữa.',
    commonMistakes: '⚠️ Lỗi hay gặp: Khi đã có "didn\'t" mà vẫn chia quá khứ (Nói "I didn\'t went" là sai, phải nói "I didn\'t go"). Hoặc nhầm lẫn giữa WAS (số ít) và WERE (số nhiều).',
    grammarCategory: 'Thì Động Từ (Verb Tense)',
    examples: [
      {
        english: 'Yesterday, I visited my grandparents in the countryside.',
        vietnamese: 'Hôm qua, mình đã về thăm ông bà ở quê (động từ thêm -ed).',
        ipa: '/ˈjestədeɪ, aɪ ˈvɪzɪtɪd maɪ ˈɡrænpeərənts ɪn ðə ˈkʌntrisaɪd/'
      },
      {
        english: 'We went to Ha Long Bay last summer holiday.',
        vietnamese: 'Chúng mình đã đi vịnh Hạ Long vào kỳ nghỉ hè năm ngoái (go đổi thành went).',
        ipa: '/wiː went tuː hɑː lɒŋ beɪ lɑːst ˈsʌmə ˈhɒlədeɪ/'
      },
      {
        english: 'Where were you yesterday? - I was at home.',
        vietnamese: 'Hôm qua bạn ở đâu? - Mình đã ở nhà.',
        ipa: '/weər wɜːr juː ˈjestədeɪ? - aɪ wɒz æt həʊm/'
      }
    ],
    encouragement: 'Rất xuất sắc! Học sinh lớp 4 và 5 nắm chắc thì này sẽ viết đoạn văn kể chuyện cực kỳ hay!',
    suggestedFollowUps: [
      'Bảng 10 động từ bất quy tắc quen thuộc nhất trong sách Global Success',
      'Cách phát âm đuôi -ed chuẩn: /t/, /d/, /ɪd/',
      'Phân biệt Was và Were'
    ]
  },
  {
    id: 'future-near',
    category: 'tenses',
    categoryLabel: '⏰ Các thì tiếng Anh',
    keywords: ['tương lai', 'future', 'going to', 'will', 'dự định', 'ngày mai', 'tomorrow', 'next week'],
    title: 'Thì Tương lai gần với "Be going to" & "Will"',
    shortAnswer: '"Be going to" dùng cho kế hoạch, dự định chắc chắn từ trước. "Will" dùng cho quyết định đưa ra ngay lúc nói.',
    explanation: 'Trong chương trình Global Success (Lớp 4 & 5), các con học rất nhiều về dự định cuối tuần hoặc kỳ nghỉ:\n• Cấu trúc: S + am/is/are + going to + V (nguyên thể).\nVí dụ: "I am going to visit my friend tomorrow." (Mình dự định thăm bạn vào ngày mai).\n• "Will" + V: Dùng khi vừa nghĩ ra quyết định ngay lúc nói hoặc đưa ra lời hứa: "I will help you!" (Mình sẽ giúp bạn!).',
    keyRule: '⚡ Công thức vàng: S + be + GOING TO + Động từ nguyên thể! Nhớ: Sau "going to" luôn là động từ giữ nguyên con nhé!',
    whyUsed: 'Phân biệt "going to" và "will" giúp diễn tả chính xác mức độ chuẩn bị: có kế hoạch từ trước (going to) hay ngẫu hứng bộc phát (will).',
    commonMistakes: '⚠️ Lỗi hay gặp: Quên động từ "be" trước going to (nói "I going to swim" là sai, phải là "I am going to swim"). Hoặc chia động từ sau to (nói "going to swimming" là sai, phải là "going to swim").',
    grammarCategory: 'Thì Động Từ (Verb Tense)',
    examples: [
      {
        english: 'What are you going to do this weekend? - I am going to stay at home.',
        vietnamese: 'Bạn dự định làm gì cuối tuần này? - Mình sẽ ở nhà.',
        ipa: '/wɒt ɑːr juː ˈɡəʊɪŋ tuː duː ðɪs ˌwiːkˈend? - aɪ æm ˈɡəʊɪŋ tuː steɪ æt həʊm/'
      },
      {
        english: 'They are going to visit Hue Imperial City next month.',
        vietnamese: 'Họ dự định sẽ đi thăm Cố đô Huế vào tháng sau.',
        ipa: '/ðeɪ ɑːr ˈɡəʊɪŋ tuː ˈvɪzɪt hweɪ ɪmˈpɪəriəl ˈsɪti nekst mʌnθ/'
      }
    ],
    encouragement: 'Con hiểu bài rất sâu sắc! Hãy thử nói một dự định của con vào ngày mai cho cô nghe nhé!',
    suggestedFollowUps: [
      'Phân biệt "I am going to" và "I will"',
      'Cách đặt câu hỏi với What are you going to do?',
      'Sau like, love, enjoy dùng động từ dạng nào?'
    ]
  },
  {
    id: 'a-vs-an',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['a', 'an', 'khi nào dùng a', 'khi nào dùng an', 'mạo từ', 'uể oải', 'nguyên âm', 'phụ âm', 'an hour', 'a university'],
    title: 'Cách dùng mạo từ "A" và "AN" chuẩn ngữ pháp',
    shortAnswer: 'Cả "a" và "an" đều có nghĩa là "MỘT" đồ vật, con vật hoặc người đếm được.',
    explanation: 'Quy tắc cơ bản:\n• Dùng "AN" khi từ đứng sau bắt đầu bằng một NGUYÊN ÂM.\n• Dùng "A" khi từ đứng sau bắt đầu bằng một PHỤ ÂM.\n\n⚡ Lưu ý chuẩn ngữ pháp quốc tế: Tính theo ÂM THANH PHÁT ÂM, không chỉ nhìn mặt chữ viết!\nVí dụ: "an hour" (một giờ đồng hồ) dùng AN vì chữ h câm, phát âm là /aʊər/ bắt đầu bằng nguyên âm.\n"A university" (một trường đại học) dùng A vì phát âm là /ˌjuːnɪˈvɜːsəti/, âm /j/ là bán phụ âm.',
    keyRule: '⚡ Mẹo vàng ghi nhớ: Chữ "UỂ OẢI" (U - E - O - A - I). Đa số các từ bắt đầu bằng âm trong UỂ OẢI thì dùng AN (an apple, an elephant, an orange, an umbrella, an ice cream)!',
    whyUsed: 'Người bản xứ dùng "an" trước nguyên âm để khi phát âm không bị khựng lại hay ngắc ngứ. Đọc "an apple" /æn ˈæp.l/ nghe mượt mà và dễ chịu hơn rất nhiều so với "a apple".',
    commonMistakes: '⚠️ Lỗi hay gặp: Dùng a/an với danh từ số nhiều hoặc danh từ không đếm được (Nói "an apples" hay "a water" là sai hoàn toàn! Chỉ dùng a/an với 1 danh từ đếm được số ít).',
    grammarCategory: 'Mạo Từ (Articles)',
    examples: [
      {
        english: 'This is an apple, and that is a banana.',
        vietnamese: 'Đây là một quả táo (dùng an), và kia là một quả chuối (dùng a).',
        ipa: '/ðɪs ɪz ən ˈæpl, ænd ðæt ɪz ə bəˈnɑːnə/'
      },
      {
        english: 'I have an umbrella and a raincoat.',
        vietnamese: 'Mình có một chiếc ô (dùng an) và một chiếc áo mưa (dùng a).',
        ipa: '/aɪ hæv ən ʌmˈbrelə ænd ə ˈreɪnkəʊt/'
      },
      {
        english: 'My mother is an English teacher.',
        vietnamese: 'Mẹ mình là một cô giáo dạy tiếng Anh (English bắt đầu bằng âm /ɪ/).',
        ipa: '/maɪ ˈmʌðər ɪz ən ˈɪŋɡlɪʃ ˈtiːtʃər/'
      }
    ],
    encouragement: 'Con nhớ mẹo UỂ OẢI và chú ý âm thanh phát âm là không bao giờ làm bài sai nữa!',
    suggestedFollowUps: [
      'Tại sao "an hour" lại dùng an mà chữ h không nằm trong uể oải?',
      'Khi nào dùng "The" thay vì "A / An"?',
      'Danh từ không đếm được dùng từ gì thay cho a/an?'
    ]
  },
  {
    id: 'in-on-at',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['in', 'on', 'at', 'giới từ', 'thời gian', 'nơi chốn', 'on monday', 'at 7 oclock', 'in the morning', 'at home'],
    title: 'Phân biệt giới từ IN - ON - AT chuẩn xác',
    shortAnswer: 'IN dùng cho không gian lớn/bên trong, ON dùng cho bề mặt/tiếp xúc, AT dùng cho mốc giờ hoặc địa điểm cụ thể.',
    explanation: 'Quy tắc Hình Phễu Thời Gian & Địa Điểm (từ RỘNG đến HẸP):\n\n1. VỀ THỜI GIAN:\n• IN (rộng nhất): Mùa, năm, tháng, buổi trong ngày (in summer, in 2026, in May, in the morning).\n• ON (vừa phải): Các thứ trong tuần, ngày cụ thể, ngày lễ có chữ day (on Monday, on my birthday, on Christmas Day).\n• AT (chính xác nhất): Giờ giấc cụ thể, thời điểm chính xác (at 7 o’clock, at noon, at midnight, at the weekend).\n\n2. VỀ NƠI CHỐN:\n• IN: Ở bên trong phòng, thành phố, quốc gia (in the classroom, in Hanoi, in Vietnam).\n• ON: Ở trên bề mặt, tầng nhà, tên đường (on the desk, on the wall, on the 2nd floor).\n• AT: Tại một điểm dừng chân cụ thể (at school, at home, at the bus stop, at the zoo).',
    keyRule: '⚡ Mẹo tam giác ngược: IN (to nhất: năm, tháng, nước) -> ON (vừa vừa: thứ, ngày, bề mặt) -> AT (nhỏ nhất, chuẩn nhất: giờ giấc, địa điểm chấm tròn trên bản đồ)!',
    whyUsed: 'Tiếng Anh phân chia các cấp độ không gian và thời gian từ bao quát đến chi tiết để câu nói rõ ràng, người nghe không bị mơ hồ.',
    commonMistakes: '⚠️ Lỗi hay gặp: Nhầm giữa thứ và tháng (on Monday nhưng in May). Nhầm cụm từ cố định: nói "at home", "at school", nhưng "in the room".',
    grammarCategory: 'Giới Từ (Prepositions)',
    examples: [
      {
        english: 'I go to school at seven o’clock on Mondays.',
        vietnamese: 'Mình đi học lúc 7 giờ (dùng at) vào các ngày thứ Hai (dùng on).',
        ipa: '/aɪ ɡəʊ tuː skuːl æt ˈsevn əˈklɒk ɒn ˈmʌndeɪz/'
      },
      {
        english: 'My birthday is in November, on November 15th.',
        vietnamese: 'Sinh nhật mình vào tháng 11 (in November), vào ngày 15 tháng 11 (on November 15th).',
        ipa: '/maɪ ˈbɜːθdeɪ ɪz ɪn nəʊˈvembər, ɒn nəʊˈvembər ðə fɪfˈtiːnθ/'
      },
      {
        english: 'The cat is sleeping on the sofa in the living room.',
        vietnamese: 'Chú mèo đang ngủ trên ghế sofa (on the sofa) trong phòng khách (in the living room).',
        ipa: '/ðə kæt ɪz ˈsliːpɪŋ ɒn ðə ˈsəʊfə ɪn ðə ˈlɪvɪŋ ruːm/'
      }
    ],
    encouragement: 'Con nhớ mô hình hình phễu là làm đúng mọi bài tập giới từ trong sách giáo khoa!',
    suggestedFollowUps: [
      'Tại sao lại nói "at night" mà lại là "in the morning"?',
      'Giới từ đi với phương tiện giao thông: in a car vs on a bus',
      'Cách dùng under, behind, next to'
    ]
  },
  {
    id: 'how-many-how-much',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['how many', 'how much', 'đếm được', 'không đếm được', 'giá tiền', 'bao nhiêu', 'water', 'pens', 'money'],
    title: 'Phân biệt "HOW MANY" và "HOW MUCH"',
    shortAnswer: 'HOW MANY dùng cho danh từ đếm được số nhiều. HOW MUCH dùng cho danh từ không đếm được hoặc hỏi GIÁ TIỀN.',
    explanation: '1. HOW MANY:\n• Dùng cho danh từ ĐẾM ĐƯỢC số nhiều (đếm 1 cái, 2 cái, 3 cái được, có thêm đuôi -s/-es).\n• Công thức: How many + Danh từ số nhiều + are there / do you have?\nVí dụ: How many books, How many pencils, How many cats.\n\n2. HOW MUCH:\n• Dùng cho danh từ KHÔNG ĐẾM ĐƯỢC (chất lỏng, hạt nhỏ, chất bột: water, milk, rice, sugar) hoặc tiền bạc (money).\n• Dùng để HỎI GIÁ TIỀN: How much is it? / How much are they? (Cái này giá bao nhiêu tiền?).',
    keyRule: '⚡ Mẹo vàng: Cứ thấy đếm ngón tay 1, 2, 3 được (pens, rulers, apples) thì dùng HOW MANY. Cứ thấy chất lỏng đổ vào cốc (nước, sữa) hoặc hỏi giá tiền thì dùng HOW MUCH!',
    whyUsed: 'Nước hay sữa không thể đếm "1 nước, 2 nước" mà phải đo bằng lượng cốc hay chai, vì thế tiếng Anh dùng "much" cho khối lượng không đếm rời từng cái.',
    commonMistakes: '⚠️ Lỗi hay gặp: Quên thêm số nhiều sau How many ("How many pen" là sai, phải là "How many pens"). Nhầm từ "money" (tiền): từ money trong tiếng Anh là danh từ không đếm được nên phải dùng "How much money".',
    grammarCategory: 'Từ Để Hỏi & Lượng Từ (Quantifiers)',
    examples: [
      {
        english: 'How many pens do you have? - I have four pens.',
        vietnamese: 'Bạn có bao nhiêu cây bút? - Mình có 4 cây bút (danh từ đếm được số nhiều).',
        ipa: '/haʊ ˈmeni penz duː juː hæv? - aɪ hæv fɔːr penz/'
      },
      {
        english: 'How much water do you drink every day? - I drink three bottles of water.',
        vietnamese: 'Bạn uống bao nhiêu nước mỗi ngày? - Mình uống 3 chai nước.',
        ipa: '/haʊ mʌtʃ ˈwɔːtər duː juː drɪŋk ˈevri deɪ?/'
      },
      {
        english: 'How much is this school bag? - It is one hundred thousand dong.',
        vietnamese: 'Chiếc cặp sách này giá bao nhiêu? - Nó có giá 100.000 đồng (hỏi giá tiền).',
        ipa: '/haʊ mʌtʃ ɪz ðɪs skuːl bæɡ? - ɪt ɪz wʌn ˈhʌndrəd ˈθaʊznd dɒŋ/'
      }
    ],
    encouragement: 'Con phân biệt chuẩn xác lắm! Nhớ áp dụng khi đi siêu thị hay nhà sách nhé!',
    suggestedFollowUps: [
      'Tại sao "money" lại là danh từ không đếm được?',
      'Cách dùng some và any',
      'Cách trả lời khi được hỏi giá tiền'
    ]
  },
  {
    id: 'do-vs-does',
    category: 'why',
    categoryLabel: '❓ Vì sao lại dùng từ đó?',
    keywords: ['do', 'does', 'trợ động từ', 'tại sao dùng do', 'tại sao dùng does', 'don\'t', 'doesn\'t'],
    title: 'Vì sao câu hỏi dùng "DO" mà câu khác lại dùng "DOES"?',
    shortAnswer: 'DO đi với chủ ngữ số nhiều (I, You, We, They). DOES đi với chủ ngữ số ít (He, She, It, Nam).',
    explanation: 'Trong tiếng Anh, khi đặt câu hỏi hoặc câu phủ định ở thì hiện tại đơn, động từ thường không tự nhảy lên đầu câu được mà cần một người bạn giúp đỡ, gọi là TRỢ ĐỘNG TỪ (Do hoặc Does).\n\n• Dùng DO khi chủ ngữ là: I, You, We, They hoặc danh từ số nhiều (the students, my friends).\n• Dùng DOES khi chủ ngữ là: He, She, It hoặc danh từ số ít (Nam, my sister, the dog).\n\n⚡ Quy tắc kỳ diệu: Khi đã mượn DOES hoặc DOESN\'T rồi thì động từ chính đằng sau sẽ "trả lại đuôi -s/-es", quay về dạng NGUYÊN THỂ ban đầu!',
    keyRule: '⚡ Mẹo nhớ: Does có đuôi "es" dành riêng cho He, She, It (ngôi thứ 3 số ít). Có Does thì động từ chính được nghỉ ngơi, giữ nguyên thể!',
    whyUsed: 'Đây là quy tắc hòa hợp chủ vị của tiếng Anh cổ điển, giúp người nghe nhận biết tức thì đối tượng trong câu là một người hay nhiều người ngay từ từ đầu tiên của câu hỏi.',
    commonMistakes: '⚠️ Lỗi hay gặp: Vẫn thêm -s vào động từ sau does ("Does he likes apples?" là SAI, phải là "Does he like apples?").',
    grammarCategory: 'Trợ Động Từ (Auxiliary Verbs)',
    examples: [
      {
        english: 'Do you like playing badminton? - Yes, I do.',
        vietnamese: 'Bạn có thích chơi cầu lông không? - Có, mình thích (dùng Do với You).',
        ipa: '/duː juː laɪk ˈpleɪɪŋ ˈbædmɪntən? - jes, aɪ duː/'
      },
      {
        english: 'Does she speak English? - Yes, she does.',
        vietnamese: 'Bạn ấy có nói tiếng Anh không? - Có, bạn ấy có (dùng Does với She).',
        ipa: '/dʌz ʃiː spiːk ˈɪŋɡlɪʃ? - jes, ʃiː dʌz/'
      },
      {
        english: 'He doesn’t eat spicy food.',
        vietnamese: 'Cậu ấy không ăn đồ cay (dùng doesn\'t và eat giữ nguyên thể).',
        ipa: '/hiː ˈdʌznt iːt ˈspaɪsi fuːd/'
      }
    ],
    encouragement: 'Con hiểu rõ bản chất trợ động từ rồi đấy! Làm bài trắc nghiệm sẽ không bao giờ bị bẫy nữa!',
    suggestedFollowUps: [
      'Did khác gì Do và Does?',
      'Cách trả lời ngắn Yes/No với Do và Does',
      'Vì sao to be (am/is/are) không dùng Do/Does?'
    ]
  },
  {
    id: 'have-vs-has',
    category: 'why',
    categoryLabel: '❓ Vì sao lại dùng từ đó?',
    keywords: ['have', 'has', 'tại sao dùng has', 'tại sao dùng have', 'có', 'i have', 'she has'],
    title: 'Tại sao lại nói "I HAVE" nhưng lại là "HE HAS"?',
    shortAnswer: 'Cả HAVE và HAS đều có nghĩa là "CÓ". HAVE đi với I/You/We/They; HAS đi với He/She/It.',
    explanation: 'Từ "have" là động từ nguyên thể chỉ quyền sở hữu.\n• Khi đi với chủ ngữ số nhiều hoặc I/You: Ta dùng HAVE (I have a dog, We have English today).\n• Khi đi với chủ ngữ ngôi thứ 3 số ít (He, She, It, Lan, the cat): Động từ have bị biến đổi đặc biệt thành HAS (thay vì viết "haves", tiếng Anh rút gọn thành HAS để đọc cho êm tai).',
    keyRule: '⚡ Mẹo nhớ: HAS có chữ "S" ở cuối đi chung với He, She, It (giống như cách động từ thêm -s vậy)!',
    whyUsed: 'Trong lịch sử tiếng Anh, "haves" phát âm rất nặng và khó nói nhanh, nên người bản xứ đã rút gọn thành "has" /hæz/ cho mượt mà.',
    commonMistakes: '⚠️ Lỗi hay gặp: Nói "He have a pencil" là sai. Phải nói "He has a pencil". Nhưng trong câu hỏi "Does he have...?", vì đã có Does nên phải dùng HAVE nguyên thể!',
    grammarCategory: 'Động Từ Sở Hữu (Possessive Verbs)',
    examples: [
      {
        english: 'I have three notebooks in my backpack.',
        vietnamese: 'Mình có 3 quyển vở trong ba lô (I đi với have).',
        ipa: '/aɪ hæv θriː ˈnəʊtbʊks ɪn maɪ ˈbækpæk/'
      },
      {
        english: 'Mai has a very cute white cat.',
        vietnamese: 'Mai có một chú mèo trắng rất dễ thương (Mai là 1 người, dùng has).',
        ipa: '/maɪ hæz ə ˈveri kjuːt waɪt kæt/'
      },
      {
        english: 'Does he have any pets? - Yes, he does.',
        vietnamese: 'Cậu ấy có nuôi thú cưng nào không? (câu hỏi có Does nên dùng have).',
        ipa: '/dʌz hiː hæv ˈeni pets? - jes, hiː dʌz/'
      }
    ],
    encouragement: 'Con phát hiện ra chi tiết rất hay! Cứ nhớ chữ S cuối từ HAS là của He/She/It nhé!',
    suggestedFollowUps: [
      'Have got và Has got dùng thế nào?',
      'Khi nào dùng Have breakfast, Have lunch?',
      'Phân biệt I have và There is'
    ]
  },
  {
    id: 'like-v-ing',
    category: 'why',
    categoryLabel: '❓ Vì sao lại dùng từ đó?',
    keywords: ['like v-ing', 'sau like', 'thêm ing', 'like swimming', 'sở thích', 'love', 'enjoy'],
    title: 'Vì sao sau "LIKE" động từ lại thêm đuôi -ing (like swimming)?',
    shortAnswer: 'Sau LIKE, LOVE, ENJOY, động từ thêm -ing để biến thành một "DANH ĐỘNG TỪ" chỉ sở thích lâu dài.',
    explanation: 'Từ "like" là thích. Khi con thích một ĐỒ VẬT (danh từ), con nói: "I like apples".\nNhưng khi con thích một HÀNH ĐỘNG (như bơi lội, vẽ tranh), hành động đó phải biến thành tên của một sở thích (Danh động từ - Gerund) bằng cách thêm đuôi -ING:\n• swim (bơi) -> swimming (việc bơi lội)\n• draw (vẽ) -> drawing (việc vẽ tranh)\n• read (đọc) -> reading (việc đọc sách)\nVì thế con nói: "I like swimming" nghĩa là "Mình thích môn bơi lội".',
    keyRule: '⚡ Công thức vàng: LIKE / LOVE / ENJOY + V-ing (Diễn tả niềm yêu thích một hoạt động nào đó)!',
    whyUsed: 'Quy tắc ngữ pháp tiếng Anh quy định vị trí tân ngữ sau động từ "like" phải là một danh từ hoặc danh động từ (V-ing), không thể để một động từ nguyên thể đứng trơ trọi.',
    commonMistakes: '⚠️ Lỗi hay gặp: Nói "I like swim" (thiếu -ing) hoặc "I like to swimming" (đã có to lại còn ing là sai). Chỉ dùng "like swimming" hoặc "like to swim".',
    grammarCategory: 'Dạng Của Động Từ (Verb Forms)',
    examples: [
      {
        english: 'I like drawing pictures of animals.',
        vietnamese: 'Mình thích vẽ tranh về các loài động vật.',
        ipa: '/aɪ laɪk ˈdrɔːɪŋ ˈpɪktʃəz əv ˈænɪmlz/'
      },
      {
        english: 'My brother likes playing computer games on Saturday.',
        vietnamese: 'Anh trai mình thích chơi trò chơi điện tử vào thứ Bảy.',
        ipa: '/maɪ ˈbrʌðər laɪks ˈpleɪɪŋ kəmˈpjuːtər ɡeɪmz ɒn ˈsætədeɪ/'
      }
    ],
    encouragement: 'Bây giờ con đã hiểu tận gốc rễ vì sao lại thêm -ing rồi! Thật tự hào về con!',
    suggestedFollowUps: [
      'Quy tắc gấp đôi phụ âm khi thêm -ing (swimming, running)',
      'Phân biệt I like swimming và I am swimming',
      'Những từ nào khác đi với V-ing?'
    ]
  },
  {
    id: 'can-vs-cant',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['can', 'can\'t', 'cannot', 'khả năng', 'phát âm can cant', 'sau can'],
    title: 'Cách dùng và phát âm chuẩn "CAN" và "CAN’T"',
    shortAnswer: 'CAN nghĩa là "CÓ THỂ" làm được việc gì. CAN’T (cannot) nghĩa là "KHÔNG THỂ" làm được.',
    explanation: '• Cấu trúc: S + CAN / CAN’T + Động từ nguyên thể (không chia, không thêm s, không thêm ing).\nVí dụ: I can swim. She can dance. He can’t ride a bike.\n\n⚡ Mẹo phát âm chuẩn người bản xứ:\n• "Can" khi nói trong câu thường đọc lướt nhẹ là /kən/ (âm ơ ngắn).\n• "Can’t" đọc nhấn mạnh rõ ràng là /kɑːnt/ (giọng Anh) hoặc /kænt/ (giọng Mỹ) có âm bật t ở cuối.',
    keyRule: '⚡ Quy tắc bất di bất dịch: Sau CAN và CAN’T luôn luôn là động từ NGUYÊN THỂ (giữ nguyên gốc)!',
    whyUsed: 'CAN là một động từ khuyết thiếu (modal verb), dùng để diễn tả năng lực bẩm sinh hoặc kỹ năng học được của một người.',
    commonMistakes: '⚠️ Lỗi hay gặp: Thêm -s hoặc to sau can ("She can swims" hay "He can to swim" là SAI! Đúng phải là: "She can swim").',
    grammarCategory: 'Động Từ Khuyết Thiếu (Modal Verbs)',
    examples: [
      {
        english: 'Can you ride a bicycle? - Yes, I can.',
        vietnamese: 'Bạn có thể đi xe đạp không? - Có, mình có thể.',
        ipa: '/kæn juː raɪd ə ˈbaɪsɪkl? - jes, aɪ kæn/'
      },
      {
        english: 'My little sister can’t swim yet.',
        vietnamese: 'Em gái nhỏ của mình chưa thể bơi được.',
        ipa: '/maɪ ˈlɪtl ˈsɪstər kɑːnt swɪm jet/'
      }
    ],
    encouragement: 'Con luyện phát âm /kɑːnt/ bật âm /t/ thật rõ để người nghe phân biệt ngay nhé!',
    suggestedFollowUps: [
      'Cách đặt câu hỏi với Can you...?',
      'Sau Must và Should động từ có giữ nguyên không?',
      'Phân biệt Can và Could'
    ]
  },
  {
    id: 'look-see-watch',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['look', 'see', 'watch', 'phân biệt look see watch', 'nhìn', 'xem', 'thấy'],
    title: 'Phân biệt ba từ chỉ thị giác: "LOOK", "SEE" và "WATCH"',
    shortAnswer: 'SEE là nhìn thấy tự nhiên. LOOK là chủ động hướng mắt nhìn vào. WATCH là theo dõi chăm chú một chuyển động.',
    explanation: '1. SEE (Thấy): Đôi mắt mở ra là nhìn thấy mọi thứ lọt vào tầm mắt một cách tự nhiên, không cần cố gắng.\nVí dụ: "I see a bird in the sky." (Mình nhìn thấy một chú chim bay trên trời).\n\n2. LOOK (Nhìn): Con chủ động quay đầu hoặc hướng mắt về một vật đứng yên nào đó (thường đi với giới từ AT).\nVí dụ: "Look at the blackboard!" (Hãy nhìn lên bảng đen!).\n\n3. WATCH (Xem / Theo dõi): Con chăm chú quan sát một sự vật đang chuyển động, diễn biến qua thời gian.\nVí dụ: "Watch TV" (xem TV), "Watch a football match" (xem trận bóng đá).',
    keyRule: '⚡ Mẹo nhớ: SEE = mở mắt là thấy; LOOK = hướng mắt nhìn vào (Look at); WATCH = xem phim, xem TV có hình ảnh chuyển động!',
    whyUsed: 'Ba từ này thể hiện ba mức độ chú ý và tính chất khác nhau của hành động quan sát trong tiếng Anh.',
    commonMistakes: '⚠️ Lỗi hay gặp: Nói "see TV" hay "look TV" là SAI. Phải nói "watch TV" mới đúng ngữ pháp chuẩn bản xứ.',
    grammarCategory: 'Từ Vựng Dễ Nhầm Lẫn (Easily Confused Words)',
    examples: [
      {
        english: 'Look at the picture on the wall! Do you see the red flower?',
        vietnamese: 'Hãy nhìn vào bức tranh trên tường kìa! Bạn có thấy bông hoa màu đỏ không?',
        ipa: '/lʊk æt ðə ˈpɪktʃər ɒn ðə wɔːl! duː juː siː ðə red ˈflaʊər?/'
      },
      {
        english: 'We often watch cartoons together on Saturday evening.',
        vietnamese: 'Chúng mình thường cùng nhau xem phim hoạt hình vào tối thứ Bảy.',
        ipa: '/wiː ˈɒfn wɒtʃ kɑːˈtuːnz təˈɡeðər ɒn ˈsætədeɪ ˈiːvnɪŋ/'
      }
    ],
    encouragement: 'Câu hỏi của con cực kỳ tinh tế! Nắm được 3 từ này là trình độ tiếng Anh của con đã tiến bộ vượt bậc rồi!',
    suggestedFollowUps: [
      'Phân biệt Listen và Hear',
      'Khi nào dùng Look like?',
      'Sau Look tính từ đi như thế nào?'
    ]
  },
  {
    id: 'listen-vs-hear',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['listen', 'hear', 'phân biệt listen hear', 'nghe', 'nghe thấy', 'listen to music'],
    title: 'Phân biệt "LISTEN" và "HEAR"',
    shortAnswer: 'HEAR là vô tình nghe thấy âm thanh lọt vào tai. LISTEN là chủ động tập trung lắng nghe.',
    explanation: '• HEAR: Tai con tự nhiên nghe thấy tiếng động bất ngờ bên ngoài mà con không hề chủ định (tiếng sấm, tiếng còi xe, tiếng chuông).\nVí dụ: "Can you hear that strange noise?" (Bạn có nghe thấy tiếng động lạ kia không?).\n• LISTEN: Con chủ động dỏng tai lên, tập trung lắng nghe lời giảng, bản nhạc hay câu chuyện (luôn đi với TO khi có đối tượng đằng sau).\nVí dụ: "Listen to the teacher!" (Hãy lắng nghe cô giáo giảng bài!), "Listen to music" (Nghe nhạc).',
    keyRule: '⚡ Mẹo nhớ: HEAR là âm thanh bất chợt nhảy vào tai; LISTEN là con tự nguyện bật chế độ tập trung nghe (và nhớ đi với chữ TO: Listen to...)!',
    whyUsed: 'Sự khác biệt phản ánh ý thức chủ động (active) của người nghe hay tiếp nhận thụ động (passive).',
    commonMistakes: '⚠️ Lỗi hay gặp: Quên chữ "to" khi nghe nhạc hay nghe ai nói (nói "listen music" là sai, phải nói "listen to music").',
    grammarCategory: 'Từ Vựng Dễ Nhầm Lẫn (Easily Confused Words)',
    examples: [
      {
        english: 'Please listen carefully to what the teacher is saying.',
        vietnamese: 'Xin hãy lắng nghe cẩn thận những gì cô giáo đang nói.',
        ipa: '/pliːz ˈlɪsn ˈkeəfəli tuː wɒt ðə ˈtiːtʃər ɪz ˈseɪɪŋ/'
      },
      {
        english: 'I can hear birds singing outside my window.',
        vietnamese: 'Mình có thể nghe thấy tiếng chim hót ngoài cửa sổ.',
        ipa: '/aɪ kæn hɪər bɜːdz ˈsɪŋɪŋ ˌaʊtˈsaɪd maɪ ˈwɪndəʊ/'
      }
    ],
    encouragement: 'Con phân biệt chuẩn xác như một bạn nhỏ bản xứ rồi đấy! Giỏi lắm!',
    suggestedFollowUps: [
      'Phân biệt Look, See, Watch',
      'Tại sao nói "Listen to me" mà không nói "Hear to me"?',
      'Cách dùng Hear from someone'
    ]
  },
  {
    id: 'plural-nouns-rules',
    category: 'why',
    categoryLabel: '❓ Vì sao lại dùng từ đó?',
    keywords: ['số nhiều', 'plural', 'thêm s', 'thêm es danh từ', 'bất quy tắc', 'children', 'teeth', 'feet', 'people'],
    title: 'Quy tắc chuyển danh từ số ít sang số nhiều trong tiếng Anh',
    shortAnswer: 'Đa số danh từ thêm -s khi có từ 2 cái trở lên. Thêm -es nếu đuôi ch, sh, s, x, z, o. Một số từ đổi dạng đặc biệt.',
    explanation: '1. Quy tắc thông thường: Thêm -S vào sau danh từ (one book -> two books, a cat -> three cats).\n2. Thêm -ES: Danh từ tận cùng là -ch, -sh, -s, -x, -z, -o (Mẹo: Ông Sáu Chạy Xe Sh Zui):\n• a watch -> watches, a box -> boxes, a bus -> buses, a tomato -> tomatoes.\n3. Danh từ tận cùng bằng phụ âm + y: Đổi -y thành -ies (a baby -> babies, a story -> stories).\n4. Danh từ BẤT QUY TẮC CẦN NHỚ (không thêm s):\n• child -> children (trẻ em)\n• tooth -> teeth (răng)\n• foot -> feet (bàn chân)\n• person -> people (con người)\n• mouse -> mice (chuột)',
    keyRule: '⚡ Mẹo vàng: Cứ thấy đuôi x, s, ch, sh, o thì thêm -es. Nhớ 5 từ bất quy tắc quen thuộc: children, teeth, feet, people, mice!',
    whyUsed: 'Để báo hiệu cho người nghe biết con đang nói về một hay nhiều đồ vật, người nghe không cần hỏi lại số lượng.',
    commonMistakes: '⚠️ Lỗi hay gặp: Thêm -s vào từ đã là số nhiều (Nói "childrens" hay "peoples" là SAI vì bản thân children và people đã là số nhiều rồi).',
    grammarCategory: 'Danh Từ (Nouns)',
    examples: [
      {
        english: 'There are five boxes on the table.',
        vietnamese: 'Có 5 chiếc hộp ở trên bàn (box thêm -es thành boxes).',
        ipa: '/ðeər ɑːr faɪv ˈbɒksɪz ɒn ðə ˈteɪbl/'
      },
      {
        english: 'The children are playing hide and seek.',
        vietnamese: 'Các bạn nhỏ đang chơi trốn tìm (child số nhiều là children).',
        ipa: '/ðə ˈtʃɪldrən ɑːr ˈpleɪɪŋ haɪd ænd siːk/'
      }
    ],
    encouragement: 'Con thuộc bảng danh từ bất quy tắc này là được điểm 10 trọn vẹn trong các bài kiểm tra!',
    suggestedFollowUps: [
      'Phân biệt There is và There are',
      'Quy tắc phát âm đuôi -s và -es của danh từ',
      'Danh từ đếm được và không đếm được'
    ]
  },
  {
    id: 'there-is-there-are',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['there is', 'there are', 'có', 'miêu tả', 'there is a book', 'there are two cats'],
    title: 'Phân biệt "THERE IS" và "THERE ARE"',
    shortAnswer: 'Cả hai đều có nghĩa là "CÓ" ở đâu đó. THERE IS đi với số ít (1 cái). THERE ARE đi với số nhiều (từ 2 cái trở lên).',
    explanation: '• THERE IS (viết tắt là There’s): Đi với 1 đồ vật, 1 con vật, 1 người hoặc danh từ không đếm được.\nVí dụ: There is a pen on the desk. (Có 1 cây bút trên bàn).\nThere is some water in the glass. (Có một ít nước trong cốc).\n\n• THERE ARE: Đi với từ 2 đồ vật, con vật trở lên (danh từ số nhiều có đuôi -s).\nVí dụ: There are three cats under the bed. (Có 3 chú mèo ở gầm giường).',
    keyRule: '⚡ Mẹo nhớ: Is dành cho 1 cái (số ít). Are dành cho nhiều cái (số nhiều)!',
    whyUsed: 'Dùng There is / There are để giới thiệu sự tồn tại hay vị trí của sự vật trong không gian xung quanh.',
    commonMistakes: '⚠️ Lỗi hay gặp: Dùng từ "Have" để dịch chữ "Có" ở đầu câu (Nói "Have a book on the table" là SAI! Tiếng Anh bắt buộc phải nói "There is a book on the table").',
    grammarCategory: 'Cấu Trúc Câu (Sentence Structures)',
    examples: [
      {
        english: 'There is a big library in my school.',
        vietnamese: 'Có một thư viện lớn ở trường mình (1 thư viện, dùng There is).',
        ipa: '/ðeər ɪz ə bɪɡ ˈlaɪbrəri ɪn maɪ skuːl/'
      },
      {
        english: 'There are twenty-five students in our class.',
        vietnamese: 'Có 25 học sinh trong lớp chúng mình (25 học sinh, dùng There are).',
        ipa: '/ðeər ɑːr ˈtwenti faɪv ˈstjuːdnts ɪn ˈaʊər klɑːs/'
      }
    ],
    encouragement: 'Con nhớ rất chuẩn! Không bao giờ dùng từ "Have" để chỉ sự tồn tại nữa nhé!',
    suggestedFollowUps: [
      'Cách đặt câu hỏi với Is there...? và Are there...?',
      'Phân biệt There is và I have',
      'Cách dùng Some và Any với There is/are'
    ]
  },
  {
    id: 'this-that-these-those',
    category: 'compare',
    categoryLabel: '🔍 Phân biệt từ dễ nhầm',
    keywords: ['this', 'that', 'these', 'those', 'cái này', 'cái kia', 'những cái này', 'những cái kia', 'đại từ chỉ định'],
    title: 'Phân biệt "THIS - THAT" và "THESE - THOSE"',
    shortAnswer: 'THIS (gần, 1 cái), THAT (xa, 1 cái). THESE (gần, nhiều cái), THOSE (xa, nhiều cái).',
    explanation: 'Bảng quy tắc thần kỳ:\n• GẦN (ở ngay trong tay con, trước mặt con):\n  - 1 cái: THIS (This is my pencil - Đây là cây bút của mình).\n  - Nhiều cái: THESE (These are my pencils - Đây là những cây bút của mình).\n\n• XA (ở tít đằng kia, con phải chỉ tay ra xa):\n  - 1 cái: THAT (That is our school - Kia là ngôi trường của chúng mình).\n  - Nhiều cái: THOSE (Those are tall trees - Đằng kia là những cái cây cao).',
    keyRule: '⚡ Bảng nhớ nhanh: Gần thì This (1) / These (nhiều). Xa thì That (1) / Those (nhiều)!',
    whyUsed: 'Giúp người nghe xác định vị trí tương đối và số lượng của sự vật đang được chỉ đến.',
    commonMistakes: '⚠️ Lỗi hay gặp: Dùng This với are (nói "This are" là sai, phải là "These are"). Hoặc quên thêm -s cho danh từ sau These/Those.',
    grammarCategory: 'Đại Từ Chỉ Định (Demonstratives)',
    examples: [
      {
        english: 'This is my notebook, and that is your book over there.',
        vietnamese: 'Đây là quyển vở của mình (ở gần), và kia là quyển sách của bạn đằng kia (ở xa).',
        ipa: '/ðɪs ɪz maɪ ˈnəʊtbʊk, ænd ðæt ɪz jɔːr bʊk ˈəʊvər ðeər/'
      },
      {
        english: 'These apples are sweet, but those apples are sour.',
        vietnamese: 'Những quả táo ở đây thì ngọt, còn những quả táo đằng kia thì chua.',
        ipa: '/ðiːz ˈæplz ɑːr swiːt, bʌt ðəʊz ˈæplz ɑːr ˈsaʊər/'
      }
    ],
    encouragement: 'Tuyệt đỉnh! Con nhớ bảng 4 từ này là làm chủ toàn bộ bài giới thiệu đồ vật!',
    suggestedFollowUps: [
      'Cách hỏi What is this? vs What are these?',
      'Phân biệt This/That với It',
      'Cách chỉ đường trong tiếng Anh'
    ]
  },
  {
    id: 'question-words-wh',
    category: 'why',
    categoryLabel: '❓ Vì sao lại dùng từ đó?',
    keywords: ['wh questions', 'từ để hỏi', 'what', 'where', 'when', 'who', 'why', 'how', 'how old', 'which'],
    title: 'Ý nghĩa và cách dùng các từ để hỏi (What, Where, When, Who, Why, How...)',
    shortAnswer: 'Mỗi từ để hỏi nhắm vào một thông tin cụ thể: What (gì), Where (ở đâu), When (khi nào), Who (ai), Why (tại sao), How (thế nào).',
    explanation: 'Bảng tra cứu chuẩn sách giáo khoa Global Success:\n• WHAT: Hỏi về đồ vật, tên gọi, nghề nghiệp, hoạt động (What is your name? What do you do?).\n• WHERE: Hỏi về NƠI CHỐN, địa điểm (Where are you from? Where is my pen?).\n• WHEN: Hỏi về THỜI GIAN, thời điểm (When is your birthday?).\n• WHO: Hỏi về CON NGƯỜI (Who is that? - That is my English teacher).\n• WHY: Hỏi về LÝ DO, nguyên nhân (Why do you like monkeys? - Because they are funny).\n• HOW: Hỏi về CÁCH THỨC, sức khỏe, cảm xúc (How are you? How do you go to school?).\n• HOW OLD: Hỏi về TUỔI (How old are you? - I am eight years old).\n• WHICH: Hỏi LỰA CHỌN giữa các vật (Which subject do you like best?).',
    keyRule: '⚡ Mẹo nhớ câu hỏi: Where = nơi chốn; When = thời gian; Who = người; Why = tại sao (trả lời bằng Because)!',
    whyUsed: 'Mỗi từ WH định hướng chính xác câu trả lời mà người nói đang cần tìm kiếm.',
    commonMistakes: '⚠️ Lỗi hay gặp: Nhầm giữa Where (ở đâu) và When (khi nào). Nhầm trả lời câu hỏi Why (luôn bắt đầu bằng "Because...").',
    grammarCategory: 'Từ Để Hỏi (Wh-Question Words)',
    examples: [
      {
        english: 'Where do you live? - I live in Da Nang City.',
        vietnamese: 'Bạn sống ở đâu? - Mình sống ở thành phố Đà Nẵng (Where hỏi nơi chốn).',
        ipa: '/weər duː juː lɪv? - aɪ lɪv ɪn dɑː næŋ ˈsɪti/'
      },
      {
        english: 'Why do you want to learn English? - Because it is fun and useful.',
        vietnamese: 'Tại sao bạn muốn học tiếng Anh? - Vì nó rất vui và bổ ích (Why hỏi lý do, trả lời bằng Because).',
        ipa: '/waɪ duː juː wɒnt tuː lɜːn ˈɪŋɡlɪʃ? - bɪˈkɒz ɪt ɪz fʌn ænd ˈjuːsfl/'
      }
    ],
    encouragement: 'Con nắm toàn bộ các từ để hỏi rồi, bây giờ con có thể tự tin đặt bất kỳ câu hỏi nào trong lớp học!',
    suggestedFollowUps: [
      'Cách đặt câu hỏi với How many và How much',
      'Cách hỏi đường với How can I get to...?',
      'Cách hỏi thời tiết với What is the weather like?'
    ]
  }
];

export function findInstantKnowledge(query: string): KnowledgeTopic | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // Direct keyword match or title match
  for (const topic of TEACHER_KNOWLEDGE_BASE) {
    if (q.includes(topic.title.toLowerCase()) || topic.title.toLowerCase().includes(q)) {
      return topic;
    }
    for (const kw of topic.keywords) {
      if (q.includes(kw)) {
        return topic;
      }
    }
  }

  return null;
}
