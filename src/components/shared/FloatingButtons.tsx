'use client';

import React, { useState, useEffect } from 'react';
import { Languages, MessageSquare, X, Send, Phone, Clock, Shield } from 'lucide-react';

interface FloatingButtonsProps {
  lang: 'en' | 'ar';
  onToggleLang: () => void;
}

export default function FloatingButtons({ lang, onToggleLang }: FloatingButtonsProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot'; time: string }[]>([]);
  const isRTL = lang === 'ar';

  const whatsappNumber = '2348022220247';
  const defaultMessage = lang === 'ar' 
    ? 'مرحباً مسار، أنا مهتم بمعرفة المزيد عن بنية التحتية التجارية لممر أفريقيا-السعودية.'
    : 'Hello MASAR, I am interested in learning more about your trade corridor infrastructure for Africa–Saudi Arabia commerce.';

  // Auto-greeting when chat opens
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      const greeting = lang === 'ar' 
        ? 'مرحباً بك في مسار! 👋\n\nأنا مساعدك الافتراضي. كيف يمكنني مساعدتك اليوم؟\n\n• استفسار عن خدماتنا\n• طلب عرض أسعار\n• الشراكات\n• الدعم الفني'
        : 'Welcome to MASAR! 👋\n\nI\'m your virtual assistant. How can I help you today?\n\n• Inquiry about our services\n• Request a quote\n• Partnerships\n• Technical support';
      
      setTimeout(() => {
        setMessages([{ text: greeting, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }, 500);
    }
  }, [chatOpen, lang]);

  const quickReplies = lang === 'ar' 
    ? ['أريد عرض أسعار', 'أريد معرفة المزيد', 'شراكات', 'دعم فني']
    : ['I want a quote', 'Learn more', 'Partnerships', 'Support'];

  const handleSend = (text?: string) => {
    const msg = text || message;
    if (!msg.trim()) return;
    
    setMessages(prev => [...prev, { text: msg, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');

    // Auto-reply
    setTimeout(() => {
      let reply = '';
      if (msg.toLowerCase().includes('quote') || msg.includes('عرض')) {
        reply = lang === 'ar' 
          ? 'شكراً لاهتمامك! لطلب عرض أسعار، يرجى تزويدنا بـ:\n\n• نوع السلة\n• الكمية المطلوبة\n• وجهة التسليم\n\nأو تواصل معنا عبر واتساب: +234 802 222 0247'
          : 'Thank you for your interest! For a quote request, please provide:\n\n• Commodity type\n• Required quantity\n• Delivery destination\n\nOr contact us via WhatsApp: +234 802 222 0247';
      } else if (msg.toLowerCase().includes('partner') || msg.includes('شراكات')) {
        reply = lang === 'ar'
          ? 'نرحب بالشراكات! يرجى التواصل معنا عبر:\n\n📧 partnerships@masar.sa\n📱 واتساب: +234 802 222 0247\n\nأو زوروا صفحة الشراكات على موقعنا.'
          : 'We welcome partnerships! Please contact us via:\n\n📧 partnerships@masar.sa\n📱 WhatsApp: +234 802 222 0247\n\nOr visit our partnerships page.';
      } else {
        reply = lang === 'ar'
          ? 'شكراً لتواصلك معنا! فريقنا سيرد عليك خلال 24 ساعة.\n\nللحصول على رد فوري، تواصل معنا عبر واتساب: +234 802 222 0247'
          : 'Thank you for reaching out! Our team will respond within 24 hours.\n\nFor immediate response, contact us via WhatsApp: +234 802 222 0247';
      }
      setMessages(prev => [...prev, { text: reply, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1000);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Fixed Language Toggler */}
      <button 
        onClick={onToggleLang}
        style={{
          position: 'fixed', bottom: chatOpen ? '420px' : '96px', right: '24px', zIndex: 90,
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'white', border: '2px solid #E5E9F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = '#C9A24A'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#E5E9F0'; }}
        title={lang === 'en' ? 'تبديل إلى العربية' : 'Switch to English'}
      >
        <Languages size={18} color="#0B1F3A" />
        <span style={{ fontSize: '9px', fontWeight: 700, color: '#0B1F3A', marginTop: '2px' }}>{lang === 'en' ? 'عربي' : 'EN'}</span>
      </button>

      {/* WhatsApp Chat Widget */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90 }}>
        {/* Chat Window */}
        {chatOpen && (
          <div style={{
            position: 'absolute', bottom: '70px', right: 0,
            width: '360px', maxHeight: '500px',
            background: 'white', borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            border: '1px solid #E5E9F0',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0B1F3A, #102A4C)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201,162,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M8 40V12L24 28L40 12V40" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="36" r="2" fill="#C9A24A" /></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'white', margin: 0 }}>MASAR Support</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%' }} />
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{lang === 'ar' ? 'متصل' : 'Online'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={20} color="rgba(255,255,255,0.6)" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#F9FAFB', minHeight: '250px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background: msg.sender === 'user' ? '#C9A24A' : 'white',
                    color: msg.sender === 'user' ? '#0B1F3A' : '#142235',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    whiteSpace: 'pre-line',
                  }}>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                    <p style={{ fontSize: '10px', color: msg.sender === 'user' ? 'rgba(11,31,58,0.5)' : '#98A2B3', margin: '4px 0 0', textAlign: 'right' }}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <div style={{ padding: '8px 16px', display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid #E5E9F0' }}>
                {quickReplies.map((reply, idx) => (
                  <button key={idx} onClick={() => handleSend(reply)} style={{ padding: '6px 12px', background: '#F3F4F6', border: '1px solid #E5E9F0', borderRadius: '20px', fontSize: '12px', color: '#5B6778', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E9F0', background: 'white' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                  style={{ flex: 1, padding: '10px 14px', background: '#F3F4F6', border: '1px solid #E5E9F0', borderRadius: '10px', fontSize: '13px', outline: 'none', direction: isRTL ? 'rtl' : 'ltr' }}
                />
                <button onClick={() => handleSend()} style={{ width: '40px', height: '40px', background: '#C9A24A', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={16} color="#0B1F3A" />
                </button>
              </div>
              <button onClick={openWhatsApp} style={{ width: '100%', marginTop: '8px', padding: '8px', background: '#25D366', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: chatOpen ? '#0B1F3A' : 'linear-gradient(135deg, #25D366, #128C7E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
            transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {chatOpen ? (
            <X size={24} color="white" />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          )}
        </button>
      </div>
    </>
  );
}
