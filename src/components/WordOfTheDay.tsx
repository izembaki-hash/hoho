'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Volume2, Bookmark, BookmarkCheck,
  Copy, Check, Share2, BookOpen, Lightbulb, XCircle, Star
} from 'lucide-react'

// === Types ===
type WordCategory = 'مصطلحات أدبية' | 'مصطلحات لغوية' | 'مصطلحات بلاغية' | 'مصطلحات نقدية'
type Difficulty = 'مبتدئ' | 'متوسط' | 'متقدم'
type TipCategory = 'نحو' | 'صرف' | 'بلاغة' | 'إملاء'

interface WordEntry {
  word: string
  meaning: string
  example: string
  category: WordCategory
  difficulty: Difficulty
}

interface GrammarTip {
  title: string
  rule: string
  example: string
  commonMistake: string
  category: TipCategory
}

// === 30 Arabic Vocabulary Words ===
const words: WordEntry[] = [
  { word: 'الِاسْتِعَارَةُ', meaning: 'استعمال لفظ في غير معناه الأصلي لعلاقة المشابهة مع قرينة تمنع إرادة المعنى الحقيقي', example: 'قال تعالى: "وَاخْفِضْ لَهُمَا جَنَاحَ الذُّلِّ" — استعارة تصريحية', category: 'مصطلحات بلاغية', difficulty: 'متوسط' },
  { word: 'الكِنَايَةُ', meaning: 'لفظ أُطلق وأُريد به لازم معناه مع جواز إرادة المعنى الأصلي', example: 'أبيضُ ملحاحٌ في الخصومة — كناية عن شدة الجدل', category: 'مصطلحات بلاغية', difficulty: 'متقدم' },
  { word: 'التَّشْبِيهُ', meaning: 'عقد مشاركة بين شيئين في أمر أو أكثر بأداة التشبيه', example: 'العلمُ نورٌ والجهلُ ظلامٌ — تشبيه بليغ', category: 'مصطلحات بلاغية', difficulty: 'مبتدئ' },
  { word: 'المَجَازُ', meaning: 'كلمة تُستعمل في غير ما وُضعت له لعلاقة مع قرينة تمنع إرادة المعنى الأصلي', example: 'قطعَ فلانٌ رحمَه — مجاز مرسل بعلاقة السببية', category: 'مصطلحات بلاغية', difficulty: 'متقدم' },
  { word: 'التَّقْدِيمُ وَالتَّأْخِيرُ', meaning: 'تقديم جزء من الجملة على ما كان يتأخر عنه رتبةً لأغراض بلاغية', example: 'إيّاك نعبدُ وإيّاك نستعينُ — تقديم المفعول للحصر', category: 'مصطلحات نقدية', difficulty: 'متقدم' },
  { word: 'الإِيجَازُ', meaning: 'تقليل الألفاظ مع إيفاء المعنى المقصود كاملاً', example: 'خير الكلام ما قلّ ودلّ', category: 'مصطلحات أدبية', difficulty: 'مبتدئ' },
  { word: 'الِاقْتِضَابُ', meaning: 'الانتقال من غرض إلى آخر دون رابط ظاهر ثم العودة إلى الأول', example: 'في الشعر العربي كثيراً ما ينتقل الشاعر من الغزل إلى المدح ثم يعود', category: 'مصطلحات أدبية', difficulty: 'متقدم' },
  { word: 'الطِّبَاقُ', meaning: 'الجمع بين الكلمة وضدها في الكلام لغرض بياني', example: 'وتحسبهم أيقاظاً وهم رقودٌ', category: 'مصطلحات بلاغية', difficulty: 'متوسط' },
  { word: 'المُقَابَلَةُ', meaning: 'أن يُؤتى بمعنيين أو أكثر ثم بما يقابلها على الترتيب', example: 'فأمّا من أعطى واتقى وصدّق بالحسنى فسنيسّره لليسرى', category: 'مصطلحات بلاغية', difficulty: 'متقدم' },
  { word: 'الإِطْنَابُ', meaning: 'زيادة الألفاظ على المعنى المراد لغرض بلاغي كالتوكيد أو التفصيل', example: 'الوصف المفصّل في الخطابة والرسائل الإدارية', category: 'مصطلحات أدبية', difficulty: 'متوسط' },
  { word: 'التَّوْكِيدُ', meaning: 'تكرار اللفظ أو المعنى لتقوية الدلالة وتحقيق الثقة في النفس', example: 'جاءَ جاءَ الحقّ وزهقَ الباطل', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'العَطْفُ', meaning: 'ربط كلمة بما قبلها بحرف عطف لمشاركتها في الحكم الإعرابي', example: 'جاءَ أحمدُ وسعيدٌ — عطف بحرف الواو', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'النَّدْبَةُ', meaning: 'نداء المتوفّى أو المتغيّب نداءً يفيد التفجّع والحزن', example: 'وا محمداه! — ندبة بزيادة ألف قبل هاء السكت', category: 'مصطلحات أدبية', difficulty: 'متوسط' },
  { word: 'الرِّسَالَةُ', meaning: 'كتابة موجهة من مرسل إلى مرسل إليه تتناول موضوعاً محدداً بأسلوب رسمي أو أدبي', example: 'رسالة الترضي والتأنيب لابن زيدون', category: 'مصطلحات أدبية', difficulty: 'مبتدئ' },
  { word: 'المَقَامَةُ', meaning: 'نثر قصصي يجمع بين السرد والوعظ والفصاحة في إطار خيالي', example: 'مقامات بديع الزمان الهمذاني ومقامات الحريري', category: 'مصطلحات أدبية', difficulty: 'متوسط' },
  { word: 'الفَاصِلَةُ', meaning: 'علامة ترقيم (،) تُوضع بين الجمل المتصلة المعنى أو بين أقسام الشيء', example: 'كتبَ أحمدُ رسالةً، وقرأها صديقه، وردّ عليه', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'النَّقْطَةُ', meaning: 'علامة ترقيم (.) تُوضع في نهاية الجملة التامة المعنى', example: 'العلم نور. والجهل ظلام.', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'التَّعْجِبُ', meaning: 'صيغة تُعبّر عن التعجب من شيء باستعمال وزن "ما أفعل" أو "أفعل بـ"', example: 'ما أجملَ العلم! أو أجمل بالعلم!', category: 'مصطلحات لغوية', difficulty: 'متوسط' },
  { word: 'الاسْتِفْهَامُ', meaning: 'طلب العلم بشيء لم يكن معلوماً من قبل باستعمال أدوات الاستفهام', example: 'هل تُحبّ القراءة؟ ومتى تبدأ دراستك؟', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'النِّدَاءُ', meaning: 'طلب الإقبال بحرف من حروف النداء أو ما يقوم مقامها', example: 'يا طالبُ العلمِ اجتهدْ — نداء بأداة "يا"', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'التَّضَادُّ', meaning: 'اختلاف اللفظين في المعنى كلياً بحيث يتنافيان ولا يجتمعان', example: 'الليل والنهار، والحياة والموت، والغنى والفقر', category: 'مصطلحات نقدية', difficulty: 'مبتدئ' },
  { word: 'التَّرَادُفُ', meaning: 'اتفاق لفظين أو أكثر في المعنى مع اختلافهما في اللفظ', example: 'السيف والصارم والحسام والمدى — ألفاظ مترادفة', category: 'مصطلحات نقدية', difficulty: 'متوسط' },
  { word: 'السَّجْعُ', meaning: 'توافق الفقرات في الحرف الأخير مما يُحدث إيقاعاً موسيقياً في النثر', example: 'الصبرُ مفتاحُ الفرج، والعملُ طريقُ النجاح', category: 'مصطلحات أدبية', difficulty: 'متوسط' },
  { word: 'التَّوَازُنُ', meaning: 'تماثل جملتين في الطول والتركيب والإيقاع دون اشتراط الوزن الشعري', example: 'من جدّ وجد، ومن زرع حصد', category: 'مصطلحات أدبية', difficulty: 'متوسط' },
  { word: 'الجِنَاسُ', meaning: 'اتحاد اللفظين في النطق واختلافهما في المعنى', example: 'الصبرُ صبرٌ عند المصيبة — جناس تام / ذاكر الله في الأرض فَيُذكَر في السماء — جناس ناقص', category: 'مصطلحات بلاغية', difficulty: 'متقدم' },
  { word: 'القَصْفُ اللَّفْظِيُّ', meaning: 'استعمال ألفاظ قوية جليلة التأثير تُحدث صدىً في نفس السامع', example: 'فإذا نُفخ في الصور نفخة واحدة', category: 'مصطلحات نقدية', difficulty: 'متقدم' },
  { word: 'الإِسْنَادُ', meaning: 'نسبة المسند إليه إلى المسند لتكوين الجملة العربية', example: 'العلمُ نورٌ — إسناد خبريّ', category: 'مصطلحات لغوية', difficulty: 'متوسط' },
  { word: 'الخَبَرُ', meaning: 'جملة تُفيد حكماً يمكن أن يُصدَّق أو يُكذَّب', example: 'الشمسُ مشرقةٌ — خبر يُحتمل الصدق والكذب', category: 'مصطلحات لغوية', difficulty: 'مبتدئ' },
  { word: 'الإنْشَاءُ', meaning: 'كلام لا يُحتمل التصديق ولا التكذيب لذاته كالأمر والنهي والاستفهام', example: 'اقرأ كتابك! — إنشاء طلبي', category: 'مصطلحات لغوية', difficulty: 'متوسط' },
  { word: 'المُعَلَّى', meaning: 'الشعر الذي يكون ضربُهُ متفقاً مع تفعيلة البحر دون تغيير', example: 'ما كتبتُ من شعرٍ أرجو بهِ أجراً — على بحر الكامل', category: 'مصطلحات نقدية', difficulty: 'متقدم' },
]

// === 30 Arabic Grammar Tips ===
const grammarTips: GrammarTip[] = [
  { title: 'همزة القطع والوصل', rule: 'همزة القطع تُنطق وتُكتب دائماً في بدء الكلام ووصله، وهمزة الوصل تُنطق في بدء الكلام وتسقط في وصله', example: 'اكتُب (همزة وصل)، أكرِم (همزة قطع)', commonMistake: 'كتابة همزة الوصل كهمزة قطع والعكس، مثل: "إجتهاد" بدلاً من "اجتهاد"', category: 'إملاء' },
  { title: 'التاء المربوطة والمفتوحة', rule: 'التاء المربوطة تُنطق هاءً عند الوقف وتاءً عند الوصل، والتاء المفتوحة تُنطق تاءً دائماً', example: 'مدرسة (مربوطة)، كتبتُ (مفتوحة)', commonMistake: 'خلط التاء المربوطة بالمفتوحة في الكتابة، مثل: "كتبة" بدلاً من "كتبت"', category: 'إملاء' },
  { title: 'الألف اللينة', rule: 'في الأسماء فوق الثلاثية تُكتب ألفاً ممدودة إذا كان أصلها ياءً، ومقصورة إذا كان أصلها واواً', example: 'مصطفى (أصلها ياء)، دعوى (أصلها واو)', commonMistake: 'كتابة "مصتفا" بدلاً من "مصطفى"', category: 'إملاء' },
  { title: 'لام الشمسية والقمرية', rule: 'لام التعريف: شمسية تُكتب ولا تُنطق، وقمرية تُكتب وتُنطق', example: 'الشمس (شمسية)، القمر (قمرية)', commonMistake: 'نطق اللام الشمسية مثل "الشَّلَمْس" بدلاً من "الشَّمْس"', category: 'نحو' },
  { title: 'المبتدأ والخبر', rule: 'المبتدأ: اسم مرفوع يُبدأ به الكلام، والخبر: ما يُتمم معنى المبتدأ', example: 'العلمُ نورٌ — العلم: مبتدأ مرفوع، نور: خبر مرفوع', commonMistake: 'نصب الخبر بالخطأ مثل: "العلمُ نوراً"', category: 'نحو' },
  { title: 'كان وأخواتها', rule: 'كان وأخواتها: أفعال ناقصة تدخل على الجملة الاسمية فترفع المبتدأ وتنصب الخبر', example: 'كانَ الطالبُ مجتهداً — الطالب: اسم كان مرفوع، مجتهداً: خبر كان منصوب', commonMistake: 'رفع خبر كان مثل: "كان الطالبُ مجتهدٌ" بدلاً من "مجتهداً"', category: 'نحو' },
  { title: 'إنَّ وأخواتها', rule: 'إنَّ وأخواتها: حروف ناسخة تدخل على الجملة الاسمية فتنصب المبتدأ وترفع الخبر', example: 'إنَّ العلمَ نورٌ — العلم: اسم إن منصوب، نور: خبر إن مرفوع', commonMistake: 'رفع اسم إن مثل: "إنَّ العلمُ نورٌ" بدلاً من "العلمَ"', category: 'نحو' },
  { title: 'الفاعل والمفعول به', rule: 'الفاعل: اسم مرفوع يدل على من قام بالفعل، والمفعول به: اسم منصوب وقع عليه فعل الفاعل', example: 'قرأَ الطالبُ الكتابَ — الطالب: فاعل مرفوع، الكتاب: مفعول به منصوب', commonMistake: 'نصب الفاعل مثل: "قرأَ الطالبَ الكتابُ"', category: 'نحو' },
  { title: 'المضاف إليه', rule: 'المضاف إليه: اسم يُضاف إلى اسم قبله ليبيّن معناه، وهو مجرور دائماً', example: 'كتابُ العلمِ — العلم: مضاف إليه مجرور', commonMistake: 'تنكير المضاف مثل: "كتابٌ علمٍ" بدلاً من "كتابُ علمٍ"', category: 'نحو' },
  { title: 'النعت (الصفة)', rule: 'النعت: تابع يُبيّن صفة في متبوعه، ويتبعه في الإعراب والتعريف والنكرة', example: 'جاءَ الطالبُ المجتهدُ — المجتهد: نعت مرفوع', commonMistake: 'عدم مطابقة النعت لمنعوته مثل: "الطالبُ المجتهدةُ"', category: 'نحو' },
  { title: 'المشتقات', rule: 'المشتقات: أسماء تُؤخذ من الفعل وتدل على معنى مخصوص، مثل: اسم الفاعل واسم المفعول والصفة المشبهة', example: 'كاتِب (اسم فاعل)، مكتوب (اسم مفعول)، حسَن (صفة مشبهة)', commonMistake: 'خلط اسم الفاعل باسم المفعول مثل: "المكتوب" بمعنى "الكاتب"', category: 'صرف' },
  { title: 'الميزان الصرفي', rule: 'الميزان الصرفي: الفاء والعين واللام، يُوزن به كل فعل ثلاثي أو رباعي أو خماسي', example: 'كتبَ: فَعَلَ، درسَ: فَعَلَ، أكرمَ: أَفْعَلَ', commonMistake: 'عدم ضبط الميزان الصرفي بالشكل مثل: "فعل" بدلاً من "فَعَلَ"', category: 'صرف' },
  { title: 'أوزان الفعل الماضي', rule: 'الفعل الماضي الثلاثي يأتي على أوزان ستة: فَعَلَ، فَعِلَ، فَعُلَ، وفعلها مفتوح', example: 'كتبَ (فَعَلَ)، عَلِمَ (فَعِلَ)، حَسُنَ (فَعُلَ)', commonMistake: 'ضبط عين الفعل خطأً مثل: "كَتِبَ" بدلاً من "كَتَبَ"', category: 'صرف' },
  { title: 'اسم التفضيل', rule: 'اسم التفضيل: اسم يدل على أن شيئين اشتركا في صفة وزاد أحدهما على الآخر، على وزن "أفعل"', example: 'أفضلُ، أكبرُ، أعلمُ — العلمُ أفضلُ من المال', commonMistake: 'تأنيث اسم التفضيل مع المذكر مثل: "أفضلَةُ" بدلاً من "أفضلُ"', category: 'صرف' },
  { title: 'الإعلال والإبدال', rule: 'الإعلال: تحويل حرف العلة لتسهيل النطق، والإبدال: وضع حرف مكان حرف', example: 'قال (أصلها: قَوَلَ — إعلال بالقلب)، باب (أصلها: بَوَاب — إبدال)', commonMistake: 'عدم معرفة أصل الكلمة المعلة مثل ظنّ أن "قال" أصلها كما هي', category: 'صرف' },
  { title: 'التصغير', rule: 'التصغير: تحويل الاسم إلى صيغة تدل على صغر الحجم أو القلة، بأوزان: فُعَيل، فُعَيْعِل، فُعَيْعيل', example: 'كُتَيِّب (تصغير كتاب)، دُرَيْهِم (تصغير درهم)', commonMistake: 'تصغير غير الثلاثي على وزن فُعَيل مثل: "كُتَيب" بدلاً من "كُتَيِّب"', category: 'صرف' },
  { title: 'الاستعارة التصريحية', rule: 'الاستعارة التصريحية: حذف المشبّه وصرّح بالمشبّه به مع وجود قرينة', example: 'رأيتُ أسداً يحاربُ — استعارة تصريحية حيث حذف الشجاع وذكر الأسد', commonMistake: 'عدم تحديد المحذوف والمذكور في الاستعارة', category: 'بلاغة' },
  { title: 'الاستعارة المكنية', rule: 'الاستعارة المكنية: حذف المشبّه به ورُمز إليه بشيء من لوازمه', example: 'يضحكُ الوردُ — استعارة مكنية حيث شبّه الورد بإنسان وحذف الإنسان وأبقى الضحك', commonMistake: 'عدم إدراك المحذوف في الاستعارة المكنية', category: 'بلاغة' },
  { title: 'الأسلوب الخبري والإنشائي', rule: 'الأسلوب الخبري: يُفيد معنى يحتمل التصديق والتكذيب، والإنشائي: لا يحتملهما', example: 'السماءُ صافيةٌ (خبري)، هل تُحبُّ العلم؟ (إنشائي)', commonMistake: 'اعتبار الاستفهام الإنشائي خبراً أو العكس', category: 'بلاغة' },
  { title: 'الأسلوب القصير', rule: 'استعمال الجمل القصيرة المتتابعة لإحداث تأثير إيقاعي وبياني في النص', example: 'حاء. رأى. غلب. انتصر. — أسلوب قصير يؤثر في السامع', commonMistake: 'الإكثار من الأسلوب القصير في غير موضع التأثير', category: 'بلاغة' },
  { title: 'علامات الترقيم: الفاصلة المنقوطة', rule: 'الفاصلة المنقوطة (؛) تُوضع بين جملتين إحداهما سبب للأخرى أو بين أقسام الشيء المتشعبة', example: 'إنّ العلمَ نور؛ فاطلبوه في كل مكان', commonMistake: 'استبدال الفاصلة المنقوطة بالفاصلة العادية أو العكس', category: 'إملاء' },
  { title: 'علامات الترقيم: النقطتان', rule: 'النقطتان (:) تُوضعان بعد القول أو الشيء وأقسامه أو قبل التفصيل', example: 'قال تعالى: "اقرأ باسم ربك الذي خلق"', commonMistake: 'وضع النقطتين في غير موضع القول أو التفصيل', category: 'إملاء' },
  { title: 'علامات الترقيم: علامة الاستفهام', rule: 'علامة الاستفهام (؟) تُوضع في نهاية الجملة الاستفهامية', example: 'متى يبدأ الامتحان؟', commonMistake: 'وضع نقطة بدلاً من علامة الاستفهام أو العكس', category: 'إملاء' },
  { title: 'علامات الترقيم: علامة التعجب', rule: 'علامة التعجب (!) تُوضع بعد الأسلوب التعجبي أو الدعاء أو التمني', example: 'ما أجملَ العلم! أو رحمَ اللهُ امرأً!', commonMistake: 'استعمالها في غير موضع التعجب أو الدعاء', category: 'إملاء' },
  { title: 'الأفعال الخمسة', rule: 'الأفعال الخمسة: كل فعل مضارع اتصل به ألف الاثنين أو واو الجماعة أو ياء المخاطبة، وتُرفع بثبوت النون وتُنصب وتُجزم بحذفها', example: 'يكتبانِ، يكتبونَ، تكتبينَ — أفعال خمسة مرفوعة', commonMistake: 'حذف نون الرفع خطأً مثل: "يكتبوا" في حالة الرفع بدلاً من "يكتبونَ"', category: 'نحو' },
  { title: 'المفعول المطلق', rule: 'المفعول المطلق: مصدر يُذكر بعد فعل من لفظه لتأكيده أو بيان عدده أو نوعه', example: 'اجتهدَ الطالبُ اجتهاداً عظيماً — اجتهاداً: مفعول مطلق منصوب', commonMistake: 'نصب غير المصدر على أنه مفعول مطلق', category: 'نحو' },
  { title: 'الحال', rule: 'الحال: اسم منصوب يُبيّن هيئة صاحبه عند وقوع الفعل، ويكون نكرة ويأتي جواباً لـ "كيف"', example: 'جاءَ الطالبُ مسروراً — مسروراً: حال منصوب', commonMistake: 'تعريف الحال مثل: "جاء الطالبُ المسروُرُ" بدلاً من "مسروراً"', category: 'نحو' },
  { title: 'التمييز', rule: 'التمييز: اسم نكرة منصوب يُزيل إبهاماً في اسم أو جملة قبله، ويكون مبهماً قبل التمييز', example: 'طابَ المكانُ هواءً — هواءً: تمييز منصوب', commonMistake: 'جرّ التمييز بالإضافة مثل: "طاب المكانُ هواءِ" بدلاً من "هواءً"', category: 'نحو' },
  { title: 'الجملة التي محلها من الإعراب', rule: 'الجمل التي لها محل إعرابي: هي الواقعة خبراً أو مبتدأ أو نعتاً أو حالاً أو مفعولاً به أو جواب شرط', example: 'الطالبُ يجتهدُ — يجتهد: جملة فعلية في محل رفع خبر', commonMistake: 'إعطاء الجملة إعراباً فردياً بدلاً من إعرابها جملةً لها محل', category: 'نحو' },
]

// === Color Mappings ===
const categoryColors: Record<WordCategory, string> = {
  'مصطلحات أدبية': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  'مصطلحات لغوية': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'مصطلحات بلاغية': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  'مصطلحات نقدية': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
}

const difficultyColors: Record<Difficulty, string> = {
  'مبتدئ': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'متوسط': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'متقدم': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const tipCategoryColors: Record<TipCategory, string> = {
  'نحو': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  'صرف': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'بلاغة': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  'إملاء': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
}

// === localStorage keys ===
const FAVORITE_WORDS_KEY = 'alta7reer-favorite-words'
const PROGRESS_KEY = 'alta7reer-wotd-progress'

// === Convert number to Arabic numeral ===
function toArabicNumeral(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  return String(num).replace(/\d/g, (d) => arabicNumerals[parseInt(d)])
}

export default function WordOfTheDay() {
  // Day-based index
  const getDailyIndex = useCallback(() => {
    const day = new Date().getDate()
    return (day - 1) % 30
  }, [])

  const [activeTab, setActiveTab] = useState<string>('word')
  const [wordIndex, setWordIndex] = useState(getDailyIndex)
  const [tipIndex, setTipIndex] = useState(getDailyIndex)
  const [copied, setCopied] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(FAVORITE_WORDS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [progress, setProgress] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem(PROGRESS_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  const currentWord = words[wordIndex]
  const currentTip = grammarTips[tipIndex]
  const dailyWordIndex = getDailyIndex()
  const isWordFavorite = favorites.includes(currentWord.word)

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITE_WORDS_KEY, JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...progress]))
    } catch {
      // ignore
    }
  }, [progress])

  // Track viewed words/tips
  const trackProgress = useCallback((key: string) => {
    setProgress(prev => {
      if (prev.has(key)) return prev
      return new Set([...prev, key])
    })
  }, [])

  // Navigation (also tracks progress)
  const handleWordNext = useCallback(() => {
    setWordIndex(i => {
      const next = (i + 1) % 30
      trackProgress(`w-${next}`)
      return next
    })
  }, [trackProgress])
  const handleWordPrev = useCallback(() => {
    setWordIndex(i => {
      const prev = (i - 1 + 30) % 30
      trackProgress(`w-${prev}`)
      return prev
    })
  }, [trackProgress])
  const handleTipNext = useCallback(() => {
    setTipIndex(i => {
      const next = (i + 1) % 30
      trackProgress(`t-${next}`)
      return next
    })
  }, [trackProgress])
  const handleTipPrev = useCallback(() => {
    setTipIndex(i => {
      const prev = (i - 1 + 30) % 30
      trackProgress(`t-${prev}`)
      return prev
    })
  }, [trackProgress])

  // Track current index on tab change
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    if (tab === 'word') {
      trackProgress(`w-${wordIndex}`)
    } else {
      trackProgress(`t-${tipIndex}`)
    }
  }, [wordIndex, tipIndex, trackProgress])

  // Toggle favorite
  const toggleFavorite = useCallback(() => {
    setFavorites(prev => {
      if (prev.includes(currentWord.word)) {
        return prev.filter(w => w !== currentWord.word)
      }
      return [...prev, currentWord.word]
    })
  }, [currentWord.word])

  // TTS - dispatch click on ContentReader
  const handleTTS = useCallback(() => {
    const ttsBtn = document.querySelector('[data-content-reader-btn]') as HTMLElement
    if (ttsBtn) ttsBtn.click()
  }, [])

  // Copy
  const handleCopy = useCallback(async () => {
    let copyText = ''
    if (activeTab === 'word') {
      copyText = `📚 كلمة اليوم: ${currentWord.word}\n📖 المعنى: ${currentWord.meaning}\n📝 مثال: ${currentWord.example}\n🏷️ ${currentWord.category} | ${currentWord.difficulty}\nمنصة التحرير الكتابي والشفهي`
    } else {
      copyText = `💡 نصيحة نحوية: ${currentTip.title}\n📐 القاعدة: ${currentTip.rule}\n📝 مثال: ${currentTip.example}\n❌ خطأ شائع: ${currentTip.commonMistake}\n🏷️ ${currentTip.category}\nمنصة التحرير الكتابي والشفهي`
    }

    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = copyText
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [activeTab, currentWord, currentTip])

  // Share
  const handleShare = useCallback(async () => {
    let shareText = ''
    if (activeTab === 'word') {
      shareText = `📚 ${currentWord.word}: ${currentWord.meaning}\n📝 ${currentWord.example}\nمنصة التحرير الكتابي والشفهي`
    } else {
      shareText = `💡 ${currentTip.title}: ${currentTip.rule}\n📝 ${currentTip.example}\nمنصة التحرير الكتابي والشفهي`
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: activeTab === 'word' ? 'كلمة اليوم' : 'نصيحة نحوية', text: shareText })
      } catch {
        // User cancelled or error
      }
    } else {
      await handleCopy()
    }
  }, [activeTab, currentWord, currentTip, handleCopy])

  // Progress stats
  const wordsViewed = [...progress].filter(k => k.startsWith('w-')).length
  const tipsViewed = [...progress].filter(k => k.startsWith('t-')).length

  return (
    <Card className="gradient-border-animate overflow-hidden" dir="rtl">
      {/* Gradient top bar */}
      <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-amber-500 to-teal-500" />

      <CardContent className="p-4 sm:p-6">
        {/* Header with progress */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {activeTab === 'word' ? <BookOpen className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                {activeTab === 'word' ? 'كلمة اليوم' : 'نصيحة نحوية'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {activeTab === 'word'
                  ? `تمت مشاهدة ${toArabicNumeral(wordsViewed)}/${toArabicNumeral(30)} كلمة`
                  : `تمت مشاهدة ${toArabicNumeral(tipsViewed)}/${toArabicNumeral(30)} نصيحة`
                }
              </p>
            </div>
          </div>
          {activeTab === 'word' && wordIndex === dailyWordIndex && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[0.65rem]">
              ⭐ كلمة اليوم
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50 mb-4 sm:mb-6">
            <TabsTrigger value="word" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm">كلمة اليوم</span>
            </TabsTrigger>
            <TabsTrigger value="grammar" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300">
              <Lightbulb className="h-4 w-4" />
              <span className="text-xs sm:text-sm">نصيحة نحوية</span>
            </TabsTrigger>
          </TabsList>

          {/* Word Tab */}
          <TabsContent value="word" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={wordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Word display */}
                <div className="text-center py-4 sm:py-6">
                  <p className="text-3xl sm:text-4xl font-bold text-foreground leading-loose" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {currentWord.word}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge className={`${categoryColors[currentWord.category]} text-[0.7rem]`}>
                      {currentWord.category}
                    </Badge>
                    <Badge className={`${difficultyColors[currentWord.difficulty]} text-[0.7rem]`}>
                      <Star className="h-3 w-3 ml-1" />
                      {currentWord.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Meaning */}
                <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                  <h4 className="text-xs font-bold text-primary mb-2">📖 المعنى</h4>
                  <p className="text-sm text-foreground leading-relaxed">{currentWord.meaning}</p>
                </div>

                {/* Example */}
                <div className="relative p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="absolute top-1 right-3 text-3xl text-primary/10 font-serif leading-none">❝</div>
                  <h4 className="text-xs font-bold text-muted-foreground mb-2">📝 مثال</h4>
                  <p className="text-sm text-foreground leading-relaxed relative z-10">{currentWord.example}</p>
                </div>

                {/* Navigation + Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleWordPrev} aria-label="الكلمة السابقة">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums min-w-[2.5rem] text-center">
                      {toArabicNumeral(wordIndex + 1)}/{toArabicNumeral(30)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleWordNext} aria-label="الكلمة التالية">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-full ${isWordFavorite ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20' : 'hover:bg-primary/10'}`} onClick={toggleFavorite} aria-label={isWordFavorite ? 'إزالة من المحفوظات' : 'حفظ الكلمة'}>
                      {isWordFavorite ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleTTS} aria-label="استمع">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 relative" onClick={handleCopy} aria-label="نسخ">
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleShare} aria-label="مشاركة">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Grammar Tab */}
          <TabsContent value="grammar" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={tipIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Tip title */}
                <div className="text-center py-3 sm:py-4">
                  <h4 className="text-xl sm:text-2xl font-bold text-foreground">{currentTip.title}</h4>
                  <Badge className={`${tipCategoryColors[currentTip.category]} text-[0.7rem] mt-2`}>
                    {currentTip.category}
                  </Badge>
                </div>

                {/* Rule */}
                <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 relative">
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-primary via-emerald-500 to-amber-500 rounded-t-xl" />
                  <h4 className="text-xs font-bold text-primary mb-2">📐 القاعدة</h4>
                  <p className="text-sm text-foreground leading-relaxed">{currentTip.rule}</p>
                </div>

                {/* Example */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                  <h4 className="text-xs font-bold text-muted-foreground mb-2">📝 مثال</h4>
                  <p className="text-sm text-foreground leading-relaxed">{currentTip.example}</p>
                </div>

                {/* Common Mistake */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <h4 className="text-xs font-bold text-red-600 dark:text-red-400">خطأ شائع</h4>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{currentTip.commonMistake}</p>
                </div>

                {/* Navigation + Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleTipPrev} aria-label="النصيحة السابقة">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums min-w-[2.5rem] text-center">
                      {toArabicNumeral(tipIndex + 1)}/{toArabicNumeral(30)}
                    </span>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleTipNext} aria-label="النصيحة التالية">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleTTS} aria-label="استمع">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10 relative" onClick={handleCopy} aria-label="نسخ">
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10" onClick={handleShare} aria-label="مشاركة">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mb-1.5">
            <span>تقدّمك في الكلمات</span>
            <span className="tabular-nums">{toArabicNumeral(wordsViewed)}/{toArabicNumeral(30)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${(wordsViewed / 30) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mb-1.5 mt-3">
            <span>تقدّمك في النصائح</span>
            <span className="tabular-nums">{toArabicNumeral(tipsViewed)}/{toArabicNumeral(30)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-amber-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(tipsViewed / 30) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
