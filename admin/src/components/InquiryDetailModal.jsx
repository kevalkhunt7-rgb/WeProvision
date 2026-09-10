import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Sparkles, ExternalLink, ArrowLeft, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

const InquiryDetailModal = ({ isOpen, onClose, inquiry, onInquiryUpdated }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (inquiry) {
      setReplySubject(`Re: ${inquiry.subject || inquiry.service || 'Your Inquiry'}`);
      setReplyMessage(`Hi ${inquiry.name || 'Valued Client'},\n\nThank you for reaching out to WeProvision Infotech regarding your ${inquiry.service || 'project'} inquiry.\n\nOur team has reviewed your request and we would be thrilled to assist you with your requirements. Please let us know a convenient time for a brief call or reply to this message with any additional specifications.\n\nBest regards,\nWeProvision Infotech Team`);
      setIsReplying(false);
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const handleSendEmailReply = async (e) => {
    e?.preventDefault();
    if (!replyMessage.trim()) {
      toast.error('Please enter a message before sending.');
      return;
    }

    setSending(true);
    try {
      const res = await api.replyInquiry(inquiry.id, {
        replySubject,
        replyMessage: replyMessage.trim()
      });

      if (res.success || res.data) {
        toast.success(res.message || `Email reply sent to ${inquiry.email}!`);
        if (res.simulated) {
          toast('Email simulated in development mode (Update EMAIL_PASS in backend/.env for live SMTP dispatch)', {
            icon: 'ℹ️',
            duration: 5000
          });
        }
        
        const updatedInquiry = res.data || { ...inquiry, status: 'Replied' };
        if (onInquiryUpdated) {
          onInquiryUpdated(updatedInquiry);
        }
        setIsReplying(false);
        onClose();
      } else {
        toast.error(res.message || 'Failed to send email reply.');
      }
    } catch (err) {
      console.error('Reply submission error:', err);
      toast.error(err.message || 'Error communicating with server.');
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (templateType) => {
    const clientName = inquiry.name || 'Valued Client';
    const serviceName = inquiry.service || 'project';

    if (templateType === 'acknowledge') {
      setReplyMessage(`Hi ${clientName},\n\nThank you for reaching out to WeProvision Infotech regarding your ${serviceName} project. We have received your inquiry and our engineering team is excited to learn more about your vision.\n\nCould you please let us know a convenient time for a brief discovery call?\n\nBest regards,\nWeProvision Infotech Team`);
    } else if (templateType === 'details') {
      setReplyMessage(`Hi ${clientName},\n\nThank you for your interest in our ${serviceName} services. To help us provide an accurate timeline and proposal, could you share a bit more detail regarding your key project requirements or design preferences?\n\nLooking forward to hearing from you!\n\nBest regards,\nWeProvision Infotech Team`);
    } else if (templateType === 'meeting') {
      setReplyMessage(`Hi ${clientName},\n\nWe would love to schedule a video consultation to review your ${serviceName} request and present how WeProvision Infotech can bring your project to life.\n\nPlease let us know your availability this week.\n\nBest regards,\nWeProvision Infotech Team`);
    }
  };

  const mailtoUrl = `mailto:${inquiry.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyMessage)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isReplying ? `Reply to ${inquiry.name}` : `Inquiry from ${inquiry.name}`}
      maxWidth="max-w-2xl"
      footer={
        isReplying ? (
          <div className="flex items-center justify-between w-full gap-3">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              disabled={sending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Inquiry</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                title="Open in default desktop mail application"
              >
                <ExternalLink size={13} />
                <span>Mail App</span>
              </a>

              <button
                type="button"
                onClick={handleSendEmailReply}
                disabled={sending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {sending ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Email Reply</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setIsReplying(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              <Mail size={14} />
              <span>Send Email Reply</span>
            </button>
          </>
        )
      }
    >
      {!isReplying ? (
        <div className="space-y-4 text-xs">
          {/* Status Bar */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 font-medium">Status</span>
            <Badge variant={inquiry.status === 'Unread' ? 'purple' : inquiry.status === 'Replied' ? 'success' : inquiry.status === 'In Progress' ? 'warning' : 'slate'}>
              {inquiry.status || 'Unread'}
            </Badge>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Client Name</span>
              <p className="font-bold text-white text-sm mt-0.5">{inquiry.name}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Company / Organization</span>
              <p className="font-bold text-white text-sm mt-0.5">{inquiry.company || 'Direct Client'}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Email Address</span>
              <p className="font-bold text-purple-400 mt-0.5">{inquiry.email}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Phone Number</span>
              <p className="font-medium text-slate-300 mt-0.5">{inquiry.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Service Interested</span>
              <p className="font-bold text-slate-200 mt-0.5">{inquiry.service || inquiry.inquiryType || 'General Inquiry'}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px]">Estimated Budget</span>
              <p className="font-bold text-emerald-400 mt-0.5">{inquiry.budget || 'Flexible'}</p>
            </div>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Subject</span>
            <p className="font-bold text-white text-sm mt-1">{inquiry.subject || inquiry.service || 'No Subject'}</p>
          </div>

          <div>
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Full Message Content</span>
            <div className="mt-1 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans min-h-[100px] whitespace-pre-wrap">
              {inquiry.message || inquiry.content || 'No message content provided.'}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSendEmailReply} className="space-y-4 text-xs">
          {/* Recipient & Subject Header */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">To Recipient</label>
              <input
                type="text"
                disabled
                value={`${inquiry.name} <${inquiry.email}>`}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-purple-300 text-xs font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Subject</label>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Subject line..."
                required
              />
            </div>
          </div>

          {/* Quick Response Templates */}
          <div>
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
              <Sparkles size={12} className="text-purple-400" />
              <span>Quick Reply Templates</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('acknowledge')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-purple-300 transition-colors"
              >
                🤝 Acknowledge & Connect
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('details')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-emerald-300 transition-colors"
              >
                📋 Request Specifications
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('meeting')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-sky-300 transition-colors"
              >
                📅 Schedule Meeting
              </button>
            </div>
          </div>

          {/* Reply Message Body */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email Message Body</label>
            <textarea
              rows={8}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-purple-500 transition-colors resize-y font-sans"
              placeholder="Write your email response here..."
              required
            />
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InquiryDetailModal;
