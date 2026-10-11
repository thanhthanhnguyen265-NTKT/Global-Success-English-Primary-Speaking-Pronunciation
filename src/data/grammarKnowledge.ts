export interface GrammarTopicKnowledge {
  keywords: string[];
  title: string;
  shortAnswer: string;
  explanation: string;
  keyRule: string;
  examples: Array<{ english: string; vietnamese: string }>;
  whyUsed: string;
  encouragement: string;
  suggestedFollowUps: string[];
}

export const VERIFIED_PRIMARY_GRAMMAR_KNOWLEDGE: GrammarTopicKnowledge[] = [
  // 1. A vs AN
  {
    keywords: ['a hay an', 'khi nào dùng a', 'khi nào dùng an', 'phân biệt a và an', 'dùng an', 'dùng a', 'a và an', 'an hour', 'a university'],
    title: 'Quy tắc vàng: Phân biệt "A" và "AN" chuẩn ngữ âm',
    shortAnswer: 'Cả "A" và "AN" đều có nghĩa là "MỘT" vật/người đếm được số ít. Dùng "AN" khi từ đứng sau bắt đầu bằng một NGUYÊN ÂM (vowel sound), dùng "A" khi bắt đầu bằng một PHỤ ÂM (consonant sound).',
    explanation: 'Rất nhiều bạn nhỏ chỉ nhìn vào mặt chữ cái, nhưng bí quyết chuẩn xác 100% của người bản ngữ là dựa vào ÂM PHÁT RA (phiên âm):\n• Dùng "AN" trước các từ phát âm bắt đầu bằng nguyên âm: /æ/, /e/, /ɪ/, /ɒ/, /ʌ/, /aʊ/...\n• Dùng "A" trước các từ phát âm bắt đầu bằng phụ âm: /b/, /p/, /t/, /d/, /k/, /s/, /j/, /w/...\n\nĐặc biệt chú ý 2 trường hợp học sinh giỏi:\n1. "an hour" (/æn ˈaʊ.ər/): Chữ "h" là âm câm, bắt đầu bằng nguyên âm /aʊ/ nên PHẢI DÙNG AN!\n2. "a university" (/ə ˌjuː.nɪˈvɜː.sə.ti/): Bắt đầu bằng chữ "u" nhưng phát âm là bán nguyên âm /j/ (giống âm "d" trong tiếng Việt), nên PHẢI DÙNG A!',
    keyRule: 'Mẹo nhớ nhanh tiểu học: Nhớ thần chú 5 nguyên âm "UỂ OẢI" (U - E - O - A - I). Nhưng nhớ nghe âm đọc đầu tiên: Âm nguyên âm dùng AN, âm phụ âm dùng A!',
    examples: [
      { english: 'An apple, an orange, an umbrella, an egg, an ice cream.', vietnamese: 'Một quả táo, một quả cam, một cái ô, một quả trứng, một que kem (nguyên âm).' },
      { english: 'An hour ago, he was an honest boy.', vietnamese: 'Một giờ trước, cậu ấy là một cậu bé thật thà (chữ h câm nên dùng an).' },
      { english: 'A book, a cat, a dog, a uniform, a university.', vietnamese: 'Một quyển sách, một con mèo, một con chó, một bộ đồng phục (phụ âm).' },
    ],
    whyUsed: 'Mục đích sinh ra từ "an" là để tránh hai nguyên âm đụng nhau gây ngắc ngứ khi nói (hiện tượng nối âm). Ví dụ nói "an apple" /æn ˈæp.l/ nghe mượt mà, tự nhiên hơn "a apple".',
    encouragement: 'Con nắm được quy tắc phiên âm này là giỏi hơn rất nhiều bạn cùng trang lứa rồi đấy! Xuất sắc!',
    suggestedFollowUps: [
      'Khi nào dùng "The" thay vì "A/An"?',
      'Danh từ số nhiều có đi với a/an không?',
      'Tại sao "a uniform" không dùng an?',
    ],
  },

  // 2. Present Simple & S/ES
  {
    keywords: ['thì hiện tại đơn', 'present simple', 'thêm s', 'thêm es', 'vì sao thêm s', 'tại sao thêm s', 'he she it thêm s', 'khi nào thêm es'],
    title: 'Thì Hiện tại đơn & Bí quyết chia động từ thêm -s / -es',
    shortAnswer: 'Thì Hiện tại đơn diễn tả thói quen lặp đi lặp lại hàng ngày, sở thích hoặc một sự thật hiển nhiên. Khi chủ ngữ là ngôi thứ 3 số ít (He, She, It, 1 người/1 vật), động từ bắt buộc thêm -s hoặc -es.',
    explanation: '1. Cấu trúc chuẩn:\n• Khẳng định (+): S + V(s/es)\n  - Chủ ngữ số nhiều (I / You / We / They): Động từ NGUYÊN THỂ (I read, they play).\n  - Chủ ngữ số ít (He / She / It / My mother / Nam): Động từ PHẢI THÊM -s hoặc -es (He reads, she plays).\n• Phủ định (-): S + do not (don’t) / does not (doesn’t) + V nguyên thể.\n• Nghi vấn (?): Do / Does + S + V nguyên thể?\n\n2. Khi nào thêm -ES?:\nKhi động từ kết thúc bằng các đuôi: O, S, CH, X, SH, Z (Mẹo nhớ: "Ông Sáu Chạy Xe SH Zui").\nVí dụ: go -> goes, watch -> watches, wash -> washes, fix -> fixes, miss -> misses.\n\n3. Đuôi Phụ âm + Y: Đổi y thành -ies (fly -> flies, study -> studies). Nhưng nguyên âm + y thì chỉ thêm -s (play -> plays).',
    keyRule: 'Công thức hòa hợp: Chủ ngữ số ít đi với động từ số ít (có đuôi -s/-es). Thần chú thêm -es: "Ông Sáu Chạy Xe SH Zui"!',
    examples: [
      { english: 'Mai watches TV every evening, but her brothers play football.', vietnamese: 'Mai xem tivi mỗi tối (chủ ngữ số ít thêm -es), nhưng các anh trai đá bóng (chủ ngữ số nhiều).' },
      { english: 'He studies English on Mondays.', vietnamese: 'Cậu ấy học tiếng Anh vào các ngày thứ Hai (study -> studies).' },
      { english: 'Does your father drive a car? - Yes, he does.', vietnamese: 'Bố bạn có lái xe ô tô không? - Có, bác ấy có lái.' },
    ],
    whyUsed: 'Quy tắc ngữ pháp tiếng Anh yêu cầu sự hòa hợp giữa Chủ ngữ và Động từ (Subject-Verb Agreement). Thêm -s/-es giúp người nghe nhận biết ngay câu chuyện đang nói về một người thứ ba.',
    encouragement: 'Con hỏi câu này rất đúng trọng tâm bài thi tiếng Anh tiểu học! Nhớ mẹo Ông Sáu Chạy Xe SH là con đạt điểm 10 ngay!',
    suggestedFollowUps: [
      'Cách phát âm đuôi -s và -es (/s/, /z/, /ɪz/)',
      'Khi nào dùng Do và khi nào dùng Does?',
      'Thì Hiện tại tiếp diễn khác thì Hiện tại đơn thế nào?',
    ],
  },

  // 3. Present Continuous
  {
    keywords: ['thì hiện tại tiếp diễn', 'present continuous', 'am is are + v-ing', 'v-ing', 'đang làm gì', 'now', 'look', 'at the moment'],
    title: 'Thì Hiện tại tiếp diễn: Hành động đang xảy ra ngay bây giờ',
    shortAnswer: 'Thì Hiện tại tiếp diễn dùng để diễn tả một hành động ĐANG DIỄN RA ngay tại thời điểm nói hoặc xung quanh thời điểm nói.',
    explanation: '1. Cấu trúc chuẩn 3 thể:\n• Khẳng định (+): S + am / is / are + V-ing\n  - I + am (I am reading)\n  - He / She / It / Danh từ số ít + is (He is swimming)\n  - You / We / They / Danh từ số nhiều + are (They are playing)\n• Phủ định (-): S + am/is/are + not + V-ing (She is not cooking)\n• Nghi vấn (?): Am / Is / Are + S + V-ing? (Are you listening? - Yes, I am.)\n\n2. Dấu hiệu nhận biết trong bài thi:\n• now (bây giờ), right now (ngay lúc này), at the moment, at present.\n• Câu mệnh lệnh đầu câu: Look! (Nhìn kìa!), Listen! (Hãy nghe kìa!), Be quiet! (Trật tự nào!).\n\n3. Quy tắc thêm đuôi -ing:\n• Tận cùng là 1 chữ "e": Bỏ e rồi thêm ing (dance -> dancing, ride -> riding).\n• 1 nguyên âm kẹp giữa 2 phụ âm: Gấp đôi phụ âm cuối rồi thêm ing (swim -> swimming, run -> running, sit -> sitting, stop -> stopping).',
    keyRule: 'Công thức thần thánh: "TO BE + V-ING" (Phải có cả 2, thiếu To Be hoặc thiếu -ing là câu bị sai ngay lập tức con nhé!).',
    examples: [
      { english: 'Look! The monkeys are climbing the trees.', vietnamese: 'Nhìn kìa! Những chú khỉ đang leo trèo trên cây.' },
      { english: 'What are you doing? - I am writing an English lesson.', vietnamese: 'Bạn đang làm gì thế? - Mình đang viết bài học tiếng Anh.' },
      { english: 'He is swimming in the pool right now.', vietnamese: 'Cậu ấy đang bơi trong hồ bơi ngay lúc này (swim gấp đôi m).' },
    ],
    whyUsed: 'Chúng mình dùng thì này vì hành động có tính chất tạm thời và đang chuyển động trước mắt, khác với thì hiện tại đơn là thói quen lâu dài.',
    encouragement: 'Con áp dụng đúng công thức To Be + V-ing là bài nói và bài viết tiếng Anh của con sẽ cực kỳ sinh động!',
    suggestedFollowUps: [
      'Tại sao động từ swim lại thành swimming (gấp đôi m)?',
      'Những động từ nào không được chia ở thì Hiện tại tiếp diễn?',
      'Phân biệt thì Hiện tại đơn và Hiện tại tiếp diễn trong bài tập',
    ],
  },

  // 4. Past Simple
  {
    keywords: ['thì quá khứ đơn', 'past simple', 'yesterday', 'last week', 'quá khứ', 'v-ed', 'động từ bất quy tắc', 'did', 'was were'],
    title: 'Thì Quá khứ đơn: Diễn tả sự việc đã xảy ra và kết thúc trong quá khứ',
    shortAnswer: 'Thì Quá khứ đơn dùng để kể lại một sự việc đã xảy ra và chấm dứt hoàn toàn trong quá khứ (ngày hôm qua, tuần trước, năm ngoái...).',
    explanation: '1. Cấu trúc với Động từ To Be:\n• S + was / were\n  - I / He / She / It / Danh từ số ít đi với WAS.\n  - You / We / They / Danh từ số nhiều đi với WERE.\n  Ví dụ: I was at home yesterday. They were in the library.\n\n2. Cấu trúc với Động từ Thường:\n• Khẳng định (+): S + V-ed (có quy tắc) hoặc V2 (bất quy tắc)\n• Phủ định (-): S + did not (didn’t) + V NGUYÊN THỂ!\n• Nghi vấn (?): Did + S + V NGUYÊN THỂ?\n  Ví dụ: Did you play football yesterday? - Yes, I did.\n\n3. Bảng 10 động từ bất quy tắc tiểu học phải thuộc làu:\n• go -> went (đi)\n• have / has -> had (có, ăn)\n• see -> saw (nhìn thấy)\n• do / does -> did (làm)\n• eat -> ate (ăn)\n• drink -> drank (uống)\n• buy -> bought (mua)\n• take -> took (chụp, lấy)\n• make -> made (làm, tạo ra)\n• read -> read (đọc - viết giống nhau nhưng đọc là /red/)',
    keyRule: 'Quy tắc vàng câu hỏi & phủ định: Khi đã mượn trợ động từ DID hoặc DIDN’T thì động từ chính PHẢI TRỞ VỀ NGUYÊN THỂ (không thêm -ed nữa)!',
    examples: [
      { english: 'Where were you yesterday? - I was at home.', vietnamese: 'Hôm qua bạn ở đâu? - Mình đã ở nhà.' },
      { english: 'Yesterday, we went to the zoo and saw elephants.', vietnamese: 'Hôm qua, chúng mình đã đi sở thú và thấy những chú voi (went, saw).' },
      { english: 'I didn’t watch TV last night. I did my homework.', vietnamese: 'Tối qua mình không xem tivi. Mình đã làm bài tập về nhà.' },
    ],
    whyUsed: 'Dùng thì này để khẳng định mốc thời gian đã trôi qua (yesterday, last night, last summer, two days ago, in 2024), giúp người nghe không bị nhầm lẫn với hiện tại.',
    encouragement: 'Học thuộc các động từ quá khứ bất quy tắc này sẽ giúp con kể chuyện siêu hay bằng tiếng Anh đấy!',
    suggestedFollowUps: [
      'Cách phát âm đuôi -ed chuẩn (/t/, /d/, /ɪd/)',
      'Phân biệt Was và Were',
      'Cách kể lại chuyến đi chơi bằng thì Quá khứ đơn',
    ],
  },

  // 5. IN - ON - AT
  {
    keywords: ['in on at', 'giới từ in on at', 'phân biệt in on at', 'khi nào dùng in', 'khi nào dùng on', 'khi nào dùng at'],
    title: 'Tam giác vàng giới từ IN - ON - AT (Thời gian & Nơi chốn)',
    shortAnswer: 'IN dùng cho không gian lớn hoặc khoảng thời gian dài; ON dùng cho bề mặt tiếp xúc hoặc ngày/thứ; AT dùng cho địa điểm cụ thể hoặc mốc giờ chính xác.',
    explanation: 'Hãy tưởng tượng chiếc phễu thu nhỏ dần từ rộng tới hẹp:\n\n1. VỀ THỜI GIAN:\n• IN (Rộng nhất): Tháng, năm, mùa, thế kỷ, buổi trong ngày\n  -> in May, in 2026, in summer, in the morning, in the afternoon.\n• ON (Cụ thể hơn): Thứ trong tuần, ngày tháng cụ thể, ngày lễ có từ "day"\n  -> on Monday, on Friday, on October 10th, on Christmas Day, on my birthday.\n• AT (Chính xác nhất): Giờ giấc cụ thể, thời điểm cố định\n  -> at 7 o’clock, at 6:30, at noon, at night, at midnight, at break time.\n\n2. VỀ NƠI CHỐN:\n• IN (Bên trong không gian khép kín, thành phố, quốc gia):\n  -> in the room, in the box, in Ha Noi, in Viet Nam.\n• ON (Trên bề mặt phẳng, trên đường, trên tầng lầu):\n  -> on the table, on the wall, on Peace Street, on the second floor.\n• AT (Tại một địa điểm/tọa độ cụ thể):\n  -> at school, at home, at the bus stop, at 105 Peace Street (có số nhà cụ thể dùng at!).',
    keyRule: 'Thần chú hình phễu: IN năm - IN tháng - IN mùa / ON ngày - ON thứ / Giờ dùng chữ AT!',
    examples: [
      { english: 'I wake up at six o’clock in the morning on weekdays.', vietnamese: 'Mình thức dậy lúc 6 giờ (at) vào buổi sáng (in) vào các ngày trong tuần (on).' },
      { english: 'The English book is on the desk in our classroom.', vietnamese: 'Quyển sách tiếng Anh ở trên bàn (on) trong phòng học của chúng mình (in).' },
      { english: 'She lives at 105 Hoa Binh Lane in Ha Noi.', vietnamese: 'Cô ấy sống ở số 105 ngõ Hòa Bình (có số nhà dùng at) tại Hà Nội (thành phố dùng in).' },
    ],
    whyUsed: 'Mỗi giới từ định vị chính xác mức độ bao quát. Dùng đúng giới từ giúp người nghe hình dung rõ vị trí và thời gian bạn muốn truyền tải.',
    encouragement: 'Nhớ bài thơ "IN năm IN tháng IN mùa / ON ngày ON thứ / Giờ dùng chữ AT" là con không bao giờ nhầm nữa!',
    suggestedFollowUps: [
      'Tại sao nói "at home" mà không nói "in home"?',
      'Giới từ đi với phương tiện: on a bus vs in a car',
      'Cách dùng under, behind, opposite, between',
    ],
  },

  // 6. HOW MANY vs HOW MUCH
  {
    keywords: ['how many', 'how much', 'phân biệt how many và how much', 'khi nào dùng how many', 'khi nào dùng how much', 'danh từ đếm được'],
    title: 'Phân biệt chính xác "HOW MANY" và "HOW MUCH"',
    shortAnswer: 'HOW MANY dùng để hỏi số lượng của danh từ đếm được số nhiều. HOW MUCH dùng để hỏi lượng của danh từ không đếm được hoặc hỏi GIÁ TIỀN.',
    explanation: '1. HOW MANY (+ Danh từ đếm được số nhiều):\n• Danh từ đếm được là những vật con có thể đếm 1, 2, 3 cái riêng biệt (thường có đuôi -s/es): pens, books, apples, cats, students.\n• Cấu trúc: How many + [Danh từ số nhiều] + are there / do you have?\n  -> How many pens do you have? - I have two pens.\n\n2. HOW MUCH (+ Danh từ không đếm được HOẶC Hỏi giá tiền):\n• Danh từ không đếm được là chất lỏng, chất bột, khái niệm không đếm từng cái được: water, milk, rice, sugar, bread, money, time.\n• Cấu trúc hỏi lượng: How much + [Danh từ không đếm được] + do you drink/eat?\n  -> How much water do you drink every day? - Two bottles.\n• Cấu trúc hỏi giá tiền: How much is / are + [Đồ vật]?\n  -> How much is this T-shirt? - It’s eighty thousand dong.',
    keyRule: 'Mẹo phân biệt: Đếm được 1, 2, 3 cái (có -s) -> dùng HOW MANY. Chất lỏng, cơm gạo, tiền bạc hoặc hỏi giá -> dùng HOW MUCH!',
    examples: [
      { english: 'How many books are there in your school bag? - There are four books.', vietnamese: 'Có bao nhiêu quyển sách trong cặp? - Có 4 quyển (đếm được).' },
      { english: 'How much milk would you like? - A glass of milk, please.', vietnamese: 'Bạn muốn dùng bao nhiêu sữa? - Cho mình một ly sữa (không đếm được).' },
      { english: 'How much are these blue shoes? - They’re one hundred thousand dong.', vietnamese: 'Đôi giày xanh này giá bao nhiêu? - Một trăm nghìn đồng (hỏi giá tiền).' },
    ],
    whyUsed: 'Tiếng Anh phân định ranh giới giữa vật thể đếm được cá thể (countable) và chất thể khối lượng (uncountable) để chia số lượng cho chính xác.',
    encouragement: 'Câu hỏi cực kỳ hay! Bây giờ con đã hoàn toàn tự tin khi đi mua đồ hay đếm đồ dùng học tập rồi!',
    suggestedFollowUps: [
      'Tại sao money (tiền) lại là danh từ không đếm được?',
      'Cách dùng a few và a little',
      'Đơn vị đo lường: a bottle of, a glass of, a bowl of',
    ],
  },

  // 7. DO vs DOES vs AM/IS/ARE
  {
    keywords: ['do hay does', 'khi nào dùng do', 'khi nào dùng does', 'phân biệt do và does', 'khi nào dùng am is are', 'do does am is are'],
    title: 'Khi nào dùng DO / DOES và khi nào dùng AM / IS / ARE?',
    shortAnswer: 'Dùng DO / DOES làm trợ động từ khi trong câu có ĐỘNG TỪ THƯỜNG (like, play, study, live). Dùng AM / IS / ARE khi câu đi với DANH TỪ, TÍNH TỪ hoặc thì HIỆN TẠI TIẾP DIỄN (V-ing).',
    explanation: 'Đây là lỗi sai phổ biến nhất của học sinh! Con hãy ghi nhớ 2 nhóm riêng biệt:\n\n1. NHÓM ĐỘNG TỪ TO BE (Am / Is / Are):\n• Đi sau là Danh từ, Tính từ, Nơi chốn hoặc V-ing:\n  - I am a pupil. (danh từ)\n  - She is friendly. (tính từ)\n  - He is at school. (nơi chốn)\n  - They are reading. (đang làm gì)\n• Tuyệt đối KHÔNG ĐƯỢC đi với động từ nguyên thể (SAI: Are you like cats? -> ĐÚNG: Do you like cats?).\n\n2. NHÓM TRỢ ĐỘNG TỪ DO / DOES:\n• Chỉ xuất hiện trong câu PHỦ ĐỊNH (-) và CÂU HỎI (?) khi trong câu có ĐỘNG TỪ CHỈ HÀNH ĐỘNG THƯỜNG:\n  - I, You, We, They -> dùng DO (Do you like football? I don’t like milk).\n  - He, She, It, Danh từ số ít -> dùng DOES (Does she live in Ha Noi? He doesn’t play chess).',
    keyRule: 'Thần chú: "Có động từ thường hành động (play, like, read...) -> Gọi trợ lý DO / DOES. Câu tả tính chất, nghề nghiệp, nơi chốn, đang làm gì -> Dùng TO BE (Am / Is / Are)"!',
    examples: [
      { english: 'Do you play badminton? - Yes, I do.', vietnamese: 'Bạn có chơi cầu lông không? (play là động từ thường nên dùng Do).' },
      { english: 'Are you a doctor? - No, I am a teacher.', vietnamese: 'Bạn có phải bác sĩ không? (doctor là danh từ nghề nghiệp nên dùng Are).' },
      { english: 'Does your sister like music? - Yes, she does.', vietnamese: 'Chị bạn có thích âm nhạc không? (chủ ngữ số ít sister đi với Does).' },
    ],
    whyUsed: 'Động từ thường trong tiếng Anh không thể tự đảo lên đầu câu để hỏi được (không thể nói "Like you apples?"), bắt buộc phải mượn trợ động từ Do/Does đứng ra làm nhiệm vụ.',
    encouragement: 'Hiểu được nguyên lý này là con đã nắm vững 80% kiến thức ngữ pháp của lớp 3, 4, 5 rồi đấy!',
    suggestedFollowUps: [
      'Tại sao không được nói "Are you like football?"',
      'Khi nào Do/Does biến thành Did?',
      'Cách trả lời ngắn Yes/No với Do và Does',
    ],
  },

  // 8. LIKE + V-ING vs WOULD LIKE
  {
    keywords: ['like v-ing', 'sau like là gì', 'would like', 'phân biệt like và would like', 'tại sao like swimming', 'thích làm gì'],
    title: 'Tại sao sau LIKE động từ lại thêm -ING? Phân biệt LIKE và WOULD LIKE',
    shortAnswer: 'Sau động từ chỉ sở thích như "like", "love", "enjoy", hành động đi sau phải thêm đuôi -ing để biến thành danh động từ (hoạt động). "Would like" là lời mời/gọi món lịch sự, đi với "to V" hoặc danh từ.',
    explanation: '1. CẤU TRÚC: LIKE + V-ING (Nói về sở thích lâu dài):\n• Khi con nói "Mình thích bơi lội", từ "bơi lội" lúc này là tên một hoạt động, nên động từ "swim" phải thêm -ing thành "swimming".\n  Ví dụ: I like singing. She likes cooking. He likes playing chess.\n\n2. CẤU TRÚC: WOULD LIKE (Lời đề nghị, mời mọc lịch sự):\n• Viết tắt là ’d like (I’d like = I would like, nghĩa là "Mình muốn / Cho mình xin").\n• Đi với danh từ món ăn/đồ uống: I’d like some milk, please. (Cho mình một ít sữa).\n• Đi với động từ: Would like + TO V: I’d like to visit Ha Long Bay. (Mình muốn đến thăm vịnh Hạ Long).\n• Câu hỏi mời bạn: Would you like some water? - Yes, please. / No, thanks.',
    keyRule: 'Phân biệt nhanh: LIKE + V-ing = Sở thích chung. WOULD LIKE = Muốn dùng món / Muốn làm việc gì ngay lúc này (lịch sự).',
    examples: [
      { english: 'What’s your hobby? - I like swimming and drawing.', vietnamese: 'Sở thích của bạn là gì? - Mình thích bơi lội và vẽ tranh (like + V-ing).' },
      { english: 'Would you like some orange juice? - Yes, please.', vietnamese: 'Bạn có muốn dùng một ít nước cam không? - Vâng, làm ơn cho mình xin (lời mời lịch sự).' },
      { english: 'I’d like a bowl of noodles for breakfast, please.', vietnamese: 'Cho mình xin một bát phở cho bữa sáng (gọi món lịch sự).' },
    ],
    whyUsed: 'Động từ trong tiếng Anh không thể đứng cạnh nhau trơ trọi mà không có liên kết. Thêm -ing biến động từ thành danh từ (Gerund), giúp câu đúng văn phạm.',
    encouragement: 'Con quan sát mẫu câu rất tinh tế! Luyện tập mẫu câu này khi vào nhà hàng hay giao tiếp là người nước ngoài khen ngợi ngay!',
    suggestedFollowUps: [
      'Cách trả lời lịch sự cho lời mời "Would you like...?"',
      'Những từ nào đi với V-ing giống like (love, hate, enjoy)?',
      'Want to V khác Would like to V như thế nào?',
    ],
  },
];

// Helper for instant local lookup (<5ms)
export function findInstantGrammarAnswer(question: string): GrammarTopicKnowledge | null {
  if (!question) return null;
  const normalized = question.toLowerCase().trim();

  // Try matching against keywords
  for (const item of VERIFIED_PRIMARY_GRAMMAR_KNOWLEDGE) {
    for (const kw of item.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        return item;
      }
    }
  }

  return null;
}
