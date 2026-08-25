'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { Mail, Phone, MapPin, Send, Building2, Users, Landmark, Globe, ArrowRight, MessageSquare, Clock, CheckCircle, Truck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', role: 'buyer', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const s = { navy: '#0B1F3A', gold: '#C9A24A', bg: '#F7F9FC', text: '#122033', textSec: '#5B6778', card: { background: '#FFFFFF', border: '1px solid #E5E9F0', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }, container: { maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' } };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contacts = [
    { icon: Mail, label: 'Email', value: 'info@masar.sa', href: 'mailto:info@masar.sa' },
    { icon: MessageSquare, label: 'WhatsApp', value: '+234 802 222 0247', href: 'https://wa.me/2348022220247' },
    { icon: Building2, label: 'Saudi Arabia', value: 'Riyadh, Saudi Arabia', href: null },
    { icon: MapPin, label: 'Nigeria', value: 'Lagos & Kano, Nigeria', href: null },
  ];

  const inquiryTypes = [
    { icon: Users, title: 'Buyer Inquiry', desc: 'Source verified African commodities for your Saudi business.', cta: 'Become a Buyer' },
    { icon: Truck, title: 'Exporter Inquiry', desc: 'Access verified Saudi buyers for your commodity supply.', cta: 'Join Network' },
    { icon: Landmark, title: 'Capital Partnership', desc: 'Finance verified trade across the corridor.', cta: 'Explore Partnership' },
    { icon: Globe, title: 'Strategic Partnership', desc: 'Build the corridor infrastructure together.', cta: 'Contact Us' },
  ];

  return (
    <PageLayout title="Contact MASAR" subtitle="Whether you are a Saudi buyer, African exporter, financial institution or strategic partner — we'd like to hear from you." breadcrumb={[{ label: 'Contact' }]}>
      {/* Inquiry Types */}
      <section style={{ padding: '3rem 1.5rem', background: 'white' }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {inquiryTypes.map((type, idx) => (
              <div key={idx} style={{ ...s.card, padding: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <type.icon size={22} color={s.gold} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: s.text, marginBottom: '0.5rem' }}>{type.title}</h3>
                <p style={{ fontSize: '13px', color: s.textSec, lineHeight: 1.6, marginBottom: '1rem' }}>{type.desc}</p>
                <a href="mailto:info@masar.sa" style={{ fontSize: '13px', fontWeight: 600, color: s.gold, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>{type.cta} <ArrowRight size={14} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Contact Info */}
      <section style={{ padding: '4rem 1.5rem', background: s.bg }}>
        <div style={s.container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {/* Form */}
            <div style={{ ...s.card, padding: '2rem' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(45,125,70,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={32} color="#2D7D46" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: s.text, marginBottom: '0.5rem' }}>Message Sent</h3>
                  <p style={{ fontSize: '14px', color: s.textSec }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: s.text, marginBottom: '1.5rem' }}>Send us a message</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} placeholder="Your name" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '8px', fontSize: '14px', outline: 'none', direction: 'ltr' }} placeholder="name@company.com" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>Company</label>
                      <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} placeholder="Company name" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>I am a</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '8px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                        <option value="buyer">Saudi Buyer</option>
                        <option value="exporter">African Exporter</option>
                        <option value="partner">Capital Partner</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#5B6778', marginBottom: '6px' }}>Message</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} style={{ width: '100%', padding: '10px 14px', background: '#F7F9FC', border: '1px solid #E5E9F0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }} placeholder="Tell us about your needs..." />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${s.gold} 0%, #E3C875 100%)`, color: s.navy, borderRadius: '8px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <div style={{ ...s.card, padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em', marginBottom: '1.5rem' }}>CONTACT INFORMATION</h3>
                {contacts.map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: idx < 3 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,162,74,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <c.icon size={18} color={s.gold} />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9BA3AE', marginBottom: '2px' }}>{c.label}</p>
                      {c.href ? (
                        <a href={c.href} style={{ fontSize: '14px', color: s.text, textDecoration: 'none', fontWeight: 500 }}>{c.value}</a>
                      ) : (
                        <p style={{ fontSize: '14px', color: s.text, fontWeight: 500, margin: 0 }}>{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ ...s.card, padding: '2rem' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: s.gold, letterSpacing: '0.08em', marginBottom: '1rem' }}>RESPONSE TIME</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Clock size={16} color="#2D7D46" />
                  <span style={{ fontSize: '14px', color: s.text }}>Institutional inquiries: Within 24 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={16} color={s.gold} />
                  <span style={{ fontSize: '14px', color: s.text }}>General inquiries: Within 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
