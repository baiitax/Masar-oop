'use client';

import React, { useState, useEffect, useRef } from 'react';

interface FloatingButtonsProps {
  lang: 'en' | 'ar' | 'fr';
  onToggleLang: () => void;
}

export default function FloatingButtons({ lang, onToggleLang }: FloatingButtonsProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot'; time: string }[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === 'ar';

  const whatsappNumber = '2348141815466';
  
  const greetings = {
    en: 'Assalamu Alaikum and welcome to MASAR! 👋\n\nI\'m your virtual assistant. How can I help you today?\n\n• Inquiry about our services\n• Request a quote\n• Partnerships\n• Technical support',
    ar: 'السلام عليكم ومرحباً بك في مسار! 👋\n\nأنا المساعد الافتراضي. كيف يمكنني مساعدتك؟\n\n• استفسار عن خدماتنا\n• طلب عرض أسعار\n• شراكات\n• دعم فني',
    fr: 'Bienvenue chez MASAR ! 👋\n\nJe suis votre assistant virtuel. Comment puis-je vous aider ?\n\n• Renseignement sur nos services\n• Demander un devis\n• Partenariats\n• Support technique'
  };

  const quickReplies = {
    en: ['Request a quote', 'How to join as buyer?', 'How to join as exporter?', 'Speak to representative'],
    ar: ['أريد عرض أسعار', 'كيف أنضم كمشتري؟', 'كيف أنضم كمصدر؟', 'أتحدث مع ممثل'],
    fr: ['Demander un devis', 'Devenir acheteur ?', 'Devenir exportateur ?', 'Parler à un représentant']
  };

  const whatsappMessages = {
    en: 'Assalamu Alaikum,\n\nI am interested in MASAR\'s trade corridor infrastructure for Africa–Saudi Arabia commerce.\n\nI would appreciate information regarding:\n• How to join as a buyer/exporter\n• Transaction terms and conditions\n• Compliance and documentation services\n\nThank you for your time.',
    ar: 'السلام عليكم ورحمة الله وبركاته،\n\nأنا مهتم بمعرفة المزيد عن خدمات منصة مسار للتجارة بين أفريقيا والمملكة العربية السعودية.\n\nأرجو التكرم بتزويدي بمزيد من المعلومات حول:\n• كيفية الانضمام كمشتري/مصدر\n• شروط وأحكام المعاملات\n• خدمات الامتثال والتوثيق\n\nشكراً لوقتكم الكريم.',
    fr: 'Bonjour,\n\nJe suis intéressé par l\'infrastructure commerciale MASAR pour le commerce Afrique–Arabie Saoudite.\n\nJ\'aimerais des informations sur :\n• Comment devenir acheteur/exportateur\n• Conditions de transaction\n• Services de conformité\n\nMerci pour votre temps.'
  };

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ text: greetings[lang], sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }, 500);
    }
  }, [chatOpen, lang]);

  const handleSend = (text?: string) => {
    const msg = text || message;
    if (!msg.trim()) return;
    
    setMessages(prev => [...prev, { text: msg, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');

    setTimeout(() => {
      let reply = '';
      if (msg.toLowerCase().includes('quote') || msg.includes('عرض') || msg.includes('devis')) {
        reply = lang === 'ar' 
          ? 'شكراً لاهتمامك! 🙏\n\nلطلب عرض أسعار، يرجى تزويدنا بـ:\n• نوع السلعة\n• الكمية المطلوبة\n• وجهة التسليم\n\nسيتواصل معك فريقنا خلال 24 ساعة.\n\n📱 واتساب: +234 814 181 5466'
          : lang === 'fr'
          ? 'Merci pour votre intérêt ! 🙏\n\nPour un devis, veuillez fournir :\n• Type de marchandise\n• Quantité requise\n• Destination\n\nNotre équipe vous contactera sous 24h.\n\n📱 WhatsApp: +234 814 181 5466'
          : 'Thank you for your interest! 🙏\n\nFor a quote request, please provide:\n• Commodity type\n• Required quantity\n• Delivery destination\n\nOur team will contact you within 24 hours.\n\n📱 WhatsApp: +234 814 181 5466';
      } else if (msg.toLowerCase().includes('buyer') || msg.includes('مشتري') || msg.includes('acheteur')) {
        reply = lang === 'ar'
          ? 'مرحباً بك! 🇸🇦\n\nللانضمام كمشتري سعودي:\n1. زيارة صفحة التسجيل\n2. إكمال التوثيق (KYB)\n3. الحصول على الموافقة\n4. بدء إنشاء طلبات الشراء\n\n📧 buyers@masar.sa'
          : lang === 'fr'
          ? 'Bienvenue ! 🇸🇦\n\nPour devenir acheteur :\n1. Visitez la page d\'inscription\n2. Complétez la vérification KYB\n3. Obtenez l\'approbation\n4. Commencez vos achats\n\n📧 buyers@masar.sa'
          : 'Welcome! 🇸🇦\n\nTo join as a Saudi buyer:\n1. Visit the registration page\n2. Complete KYB verification\n3. Get approved\n4. Start creating purchase orders\n\n📧 buyers@masar.sa';
      } else if (msg.toLowerCase().includes('exporter') || msg.includes('مصدر') || msg.includes('exportateur')) {
        reply = lang === 'ar'
          ? 'مرحباً بك! 🇳🇬\n\nللانضمام كمصدر:\n1. زيارة صفحة التسجيل\n2. إكمال التوثيق مع CAC و NEPC\n3. الحصول على درجة الثقة\n4. بدء تلقي طلبات الشراء\n\n📧 exporters@masar.sa'
          : lang === 'fr'
          ? 'Bienvenue ! 🇳🇬\n\nPour devenir exportateur :\n1. Visitez la page d\'inscription\n2. Complétez la vérification CAC & NEPC\n3. Obtenez votre Score de Confiance\n4. Recevez des commandes\n\n📧 exporters@masar.sa'
          : 'Welcome! 🇳🇬\n\nTo join as a Nigerian exporter:\n1. Visit the registration page\n2. Complete verification with CAC & NEPC\n3. Get your Trust Score\n4. Start receiving purchase orders\n\n📧 exporters@masar.sa';
      } else {
        reply = lang === 'ar'
          ? 'شكراً لتواصلك معنا! 🙏\n\nسيقوم فريقنا بالتواصل معك خلال 24 ساعة.\n\n📱 واتساب: +234 814 181 5466\n📧 info@masar.sa'
          : lang === 'fr'
          ? 'Merci de nous avoir contactés ! 🙏\n\nNotre équipe vous répondra sous 24h.\n\n📱 WhatsApp: +234 814 181 5466\n📧 info@masar.sa'
          : 'Thank you for reaching out! 🙏\n\nOur team will contact you within 24 hours.\n\n📱 WhatsApp: +234 814 181 5466\n📧 info@masar.sa';
      }
      setMessages(prev => [...prev, { text: reply, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessages[lang])}`, '_blank');
  };

  const langLabel = { en: 'عربي', ar: 'FR', fr: 'EN' };
  const langFlag = { en: '🇸🇦', ar: '🇫🇷', fr: '🇬🇧' };

  return (
    <>
      {/* Language Toggler - Left Side */}
      <button 
        onClick={onToggleLang}
        style={{
          position: 'fixed', bottom: '24px', left: '24px', zIndex: 90,
          height: '48px', padding: '0 16px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #0B1F3A, #102A4C)',
          border: '2px solid #C9A24A',
          boxShadow: '0 4px 20px rgba(11,31,58,0.3)',
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(11,31,58,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(11,31,58,0.3)'; }}
      >
        <span style={{ fontSize: '16px' }}>{langFlag[lang]}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#C9A24A' }}>{langLabel[lang]}</span>
      </button>

      {/* WhatsApp Chat Widget - Right Side */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90 }}>
        {/* Chat Window */}
        {chatOpen && (
          <div ref={chatRef} style={{
            position: 'absolute', bottom: '76px', right: 0,
            width: '380px', maxHeight: '520px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
            border: '1px solid #E5E9F0',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #075E54, #128C7E)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="white" /></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>MASAR Support</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>{lang === 'ar' ? 'متصل الآن' : lang === 'fr' ? 'En ligne' : 'Online now'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#ECE5DD', minHeight: '280px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                  <div style={{
                    maxWidth: '85%', padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    background: msg.sender === 'user' ? '#DCF8C6' : 'white',
                    color: '#142235',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    whiteSpace: 'pre-line',
                  }}>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                    <p style={{ fontSize: '10px', color: '#98A2B3', margin: '4px 0 0', textAlign: 'right' }}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div style={{ padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid #E5E9F0', background: '#F9FAFB' }}>
                {quickReplies[lang].map((reply, idx) => (
                  <button key={idx} onClick={() => handleSend(reply)} style={{ padding: '6px 12px', background: 'white', border: '1px solid #E5E9F0', borderRadius: '16px', fontSize: '11px', color: '#5B6778', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px', borderTop: '1px solid #E5E9F0', background: 'white' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك...' : lang === 'fr' ? 'Tapez votre message...' : 'Type your message...'}
                  style={{ flex: 1, padding: '10px 14px', background: '#F3F4F6', border: '1px solid #E5E9F0', borderRadius: '20px', fontSize: '13px', outline: 'none', direction: isRTL ? 'rtl' : 'ltr' }}
                />
                <button onClick={() => handleSend()} style={{ width: '40px', height: '40px', background: '#075E54', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
              </div>
              <button onClick={openWhatsApp} style={{ width: '100%', marginTop: '8px', padding: '10px', background: '#25D366', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {lang === 'ar' ? 'فتح واتساب' : lang === 'fr' ? 'Ouvrir WhatsApp' : 'Open WhatsApp'}
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: chatOpen ? '#075E54' : 'linear-gradient(135deg, #25D366, #128C7E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(37,211,102,0.4)',
            transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {chatOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
