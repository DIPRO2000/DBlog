import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { 
  PenLine, 
  Image, 
  Tags, 
  User, 
  UserX, 
  Loader2, 
  X, 
  Plus,
  Upload,
  Sparkles,
  Eye,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';

export default function CreatePost() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    author_wallet: '',
    cover_image: '',
    tags: [],
  });
  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleInputChange('cover_image', file_url);
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);

    const postData = {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim() || formData.content.slice(0, 150) + '...',
      content: formData.content.trim(),
      author: isAnonymous ? 'Anonymous' : (formData.author.trim() || 'Anonymous'),
      author_wallet: isAnonymous ? '' : formData.author_wallet.trim(),
      cover_image: formData.cover_image,
      tags: formData.tags,
      likes: 0,
      dislikes: 0,
    };

    const newPost = await base44.entities.Post.create(postData);
    setIsSubmitting(false);
    navigate(`${('Post')}?id=${newPost.id}`);
  };

  const suggestedTags = ['Web3', 'Blockchain', 'DeFi', 'NFT', 'DAO', 'Crypto', 'Technology', 'Tutorial', 'Opinion', 'News'];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <PenLine className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create Post</h1>
              <p className="text-slate-400">Share your thoughts with the decentralized world</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-800/50 p-6">
                  <Label className="text-white mb-2 block">Title *</Label>
                  <Input
                    placeholder="Enter a compelling title for your post..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl text-lg h-12"
                  />
                </Card>
              </motion.div>

              {/* Excerpt */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="bg-slate-900/50 border-slate-800/50 p-6">
                  <Label className="text-white mb-2 block">Excerpt (optional)</Label>
                  <Textarea
                    placeholder="A brief summary that appears in post previews..."
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={2}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl resize-none"
                  />
                </Card>
              </motion.div>

              {/* Content Editor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-slate-900/50 border-slate-800/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white">Content * (Markdown supported)</Label>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="bg-slate-800/50">
                        <TabsTrigger value="write" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                          <PenLine className="w-4 h-4 mr-2" />
                          Write
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {activeTab === 'write' ? (
                    <Textarea
                      placeholder="Write your post content here... You can use Markdown for formatting:&#10;&#10;## Heading&#10;**bold** and *italic*&#10;- bullet points&#10;> quotes&#10;```code blocks```"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={15}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl resize-none font-mono"
                    />
                  ) : (
                    <div className="min-h-[360px] bg-slate-800/50 border border-slate-700 rounded-xl p-4 overflow-auto">
                      {formData.content ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-4 mb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-3 mb-2">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-lg font-bold text-white mt-2 mb-1">{children}</h3>,
                              p: ({ children }) => <p className="text-slate-300 mb-3">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside text-slate-300 mb-3">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside text-slate-300 mb-3">{children}</ol>,
                              blockquote: ({ children }) => <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-400 my-3">{children}</blockquote>,
                              code: ({ children }) => <code className="bg-slate-700 text-violet-300 px-1.5 py-0.5 rounded text-sm">{children}</code>,
                              pre: ({ children }) => <pre className="bg-slate-900 border border-slate-700 rounded-lg p-3 overflow-x-auto my-3">{children}</pre>,
                            }}
                          >
                            {formData.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-20">Start writing to see preview...</p>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="bg-slate-900/50 border-slate-800/50 p-6">
                  <Label className="text-white mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4 text-violet-400" />
                    Cover Image
                  </Label>
                  
                  {formData.cover_image ? (
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      <img
                        src={formData.cover_image}
                        alt="Cover"
                        className="w-full h-40 object-cover"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleInputChange('cover_image', '')}
                        className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors mb-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-500 mb-2" />
                          <span className="text-slate-500 text-sm">Click to upload</span>
                        </>
                      )}
                    </label>
                  )}

                  <Input
                    placeholder="Or paste image URL..."
                    value={formData.cover_image}
                    onChange={(e) => handleInputChange('cover_image', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl text-sm"
                  />
                </Card>
              </motion.div>

              {/* Author Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-slate-900/50 border-slate-800/50 p-6">
                  <Label className="text-white mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-violet-400" />
                    Author Info
                  </Label>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl mb-4">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">Post Anonymously</span>
                    </div>
                    <Switch
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                  </div>

                  {!isAnonymous && (
                    <div className="space-y-3">
                      <Input
                        placeholder="Your name or pseudonym"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl"
                      />
                      <Input
                        placeholder="Wallet address (optional)"
                        value={formData.author_wallet}
                        onChange={(e) => handleInputChange('author_wallet', e.target.value)}
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl font-mono text-sm"
                      />
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card className="bg-slate-900/50 border-slate-800/50 p-6">
                  <Label className="text-white mb-3 flex items-center gap-2">
                    <Tags className="w-4 h-4 text-violet-400" />
                    Tags (max 5)
                  </Label>

                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-violet-500/10 border-violet-500/30 text-violet-300 pr-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Add Tag Input */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={formData.tags.length >= 5}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || formData.tags.length >= 5}
                      className="rounded-xl bg-violet-600 hover:bg-violet-500"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Suggested Tags */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedTags
                        .filter((tag) => !formData.tags.includes(tag))
                        .slice(0, 6)
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (formData.tags.length < 5) {
                                setFormData((prev) => ({
                                  ...prev,
                                  tags: [...prev.tags, tag],
                                }));
                              }
                            }}
                            disabled={formData.tags.length >= 5}
                            className="px-2 py-1 text-xs rounded-lg bg-slate-800/50 text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
                          >
                            + {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="w-full rounded-xl h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-lg group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Publish Post
                      <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Button>
                <p className="text-slate-500 text-xs text-center mt-2">
                  Your post will be published to the decentralized network
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}