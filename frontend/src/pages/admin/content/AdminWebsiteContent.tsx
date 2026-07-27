import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Layout, MessageSquare, PanelBottom, ChevronRight } from 'lucide-react';

const AdminWebsiteContent = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [content, setContent] = useState<any>({
    hero: { headline: '', subtitle: '', ctaText: '', ctaLink: '' },
    footer: { facebook: '', twitter: '', linkedin: '', instagram: '', contactEmail: '', contactPhone: '', address: '' },
    faqs: []
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/content', { withCredentials: true });
      if (res.data.success) {
        setContent(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch website content', error);
      toast.error('Failed to load website content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await axios.put('http://localhost:5000/api/admin/content', content, { withCredentials: true });
      if (res.data.success) {
        toast.success('Website content updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update content', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroChange = (field: string, value: string) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const handleFooterChange = (field: string, value: string) => {
    setContent({ ...content, footer: { ...content.footer, [field]: value } });
  };

  const handleFaqChange = (id: string, field: string, value: string) => {
    const updatedFaqs = content.faqs.map((faq: any) => 
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setContent({ ...content, faqs: updatedFaqs });
  };

  const addFaq = () => {
    const newFaq = { id: Date.now().toString(), question: '', answer: '' };
    setContent({ ...content, faqs: [...content.faqs, newFaq] });
  };

  const removeFaq = (id: string) => {
    setContent({ ...content, faqs: content.faqs.filter((faq: any) => faq.id !== id) });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-body">Loading content settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Website Content</h1>
          <p className="text-body mt-1">Manage public-facing pages, FAQs, and global site settings.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors border-b border-border ${activeTab === 'hero' ? 'bg-primary/5 text-primary border-l-4 border-l-primary' : 'text-heading hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5" /> Hero Section
              </div>
              {activeTab === 'hero' && <ChevronRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors border-b border-border ${activeTab === 'faqs' ? 'bg-primary/5 text-primary border-l-4 border-l-primary' : 'text-heading hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" /> FAQs
              </div>
              {activeTab === 'faqs' && <ChevronRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors ${activeTab === 'footer' ? 'bg-primary/5 text-primary border-l-4 border-l-primary' : 'text-heading hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="flex items-center gap-3">
                <PanelBottom className="w-5 h-5" /> Footer & Contact
              </div>
              {activeTab === 'footer' && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm min-h-[500px]">
            
            {/* Hero Settings */}
            {activeTab === 'hero' && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-lg font-bold text-heading border-b border-border pb-3">Hero Section (Homepage)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Headline</label>
                    <input 
                      type="text" 
                      value={content.hero?.headline || ''}
                      onChange={(e) => handleHeroChange('headline', e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                      placeholder="e.g. Learn the Skills of Tomorrow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-heading mb-2">Subtitle</label>
                    <textarea 
                      value={content.hero?.subtitle || ''}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body resize-none"
                      placeholder="Short description under the headline"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">CTA Button Text</label>
                      <input 
                        type="text" 
                        value={content.hero?.ctaText || ''}
                        onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-heading mb-2">CTA Link</label>
                      <input 
                        type="text" 
                        value={content.hero?.ctaLink || ''}
                        onChange={(e) => handleHeroChange('ctaLink', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs Settings */}
            {activeTab === 'faqs' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h2 className="text-lg font-bold text-heading">Frequently Asked Questions</h2>
                  <button onClick={addFaq} className="flex items-center gap-2 text-sm text-primary font-bold hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" /> Add FAQ
                  </button>
                </div>
                
                <div className="space-y-6">
                  {content.faqs?.map((faq: any, index: number) => (
                    <div key={faq.id} className="p-4 border border-border rounded-xl bg-gray-50 relative group">
                      <button 
                        onClick={() => removeFaq(faq.id)}
                        className="absolute top-4 right-4 text-red-500 p-1.5 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="space-y-4 pr-10">
                        <div>
                          <label className="block text-xs font-bold text-caption mb-1 uppercase">Question {index + 1}</label>
                          <input 
                            type="text" 
                            value={faq.question}
                            onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-caption mb-1 uppercase">Answer</label>
                          <textarea 
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!content.faqs || content.faqs.length === 0) && (
                    <div className="text-center py-8 text-caption">No FAQs added yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Settings */}
            {activeTab === 'footer' && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-lg font-bold text-heading border-b border-border pb-3">Footer & Contact Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider text-caption">Contact Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-heading mb-2">Support Email</label>
                        <input 
                          type="email" 
                          value={content.footer?.contactEmail || ''}
                          onChange={(e) => handleFooterChange('contactEmail', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-heading mb-2">Phone Number</label>
                        <input 
                          type="text" 
                          value={content.footer?.contactPhone || ''}
                          onChange={(e) => handleFooterChange('contactPhone', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-heading mb-2">Office Address</label>
                        <input 
                          type="text" 
                          value={content.footer?.address || ''}
                          onChange={(e) => handleFooterChange('address', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider text-caption">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                        <div key={social}>
                          <label className="block text-sm font-bold text-heading mb-2 capitalize">{social}</label>
                          <input 
                            type="text" 
                            value={content.footer?.[social] || ''}
                            onChange={(e) => handleFooterChange(social, e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-body"
                            placeholder={`https://${social}.com/...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsiteContent;
