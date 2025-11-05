import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../../lib/api';
import { toast } from '../../../components/Toast';
import { ConfirmModal } from '../../../components/ConfirmModal';

interface ContentSection {
  section: string;
  heading?: string;
  content?: string;
  [key: string]: any;
}

const AdminContent = () => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sectionName: string | null }>({
    isOpen: false,
    sectionName: null
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await api.getAllContent() as any;
      if (response.success && response.content) {
        setSections(response.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: ContentSection) => {
    setSelectedSection(section);
    setEditForm(section);
  };

  const handleSave = async () => {
    if (!selectedSection) return;

    try {
      const response = await api.updateSectionContent(selectedSection.section, editForm) as any;
      if (response.success) {
        toast.success('Content updated successfully!');
        await fetchContent();
        setSelectedSection(null);
        setEditForm({});
      } else {
        toast.error(response.error || 'Failed to update content');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update content');
    }
  };

  const handleDeleteClick = (sectionName: string) => {
    setDeleteConfirm({ isOpen: true, sectionName });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.sectionName) return;

    try {
      const response = await api.deleteSection(deleteConfirm.sectionName) as any;
      if (response.success) {
        toast.success(`Section "${deleteConfirm.sectionName}" deleted successfully!`);
        await fetchContent();
        setDeleteConfirm({ isOpen: false, sectionName: null });
      } else {
        toast.error(response.error || 'Failed to delete section');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete section');
      setDeleteConfirm({ isOpen: false, sectionName: null });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage website content sections</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sections List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Sections</h3>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <div
                      key={section.section}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedSection?.section === section.section
                          ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                      }`}
                      onClick={() => handleEdit(section)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{section.section}</p>
                          {section.heading && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {section.heading}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(section.section);
                          }}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <i className="ri-file-text-line text-3xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No content sections</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedSection ? `Edit: ${selectedSection.section}` : 'Select a section to edit'}
                </h3>
              </div>
              <div className="p-6">
                {selectedSection ? (
                  <div className="space-y-4">
                    {Object.keys(selectedSection).map((key) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                        </label>
                        {key === 'content' || (typeof editForm[key] === 'string' && editForm[key].length > 100) ? (
                          <textarea
                            value={editForm[key] || ''}
                            onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editForm[key] || ''}
                            onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                      >
                        <i className="ri-save-line mr-2"></i>
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSection(null);
                          setEditForm({});
                        }}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="ri-file-edit-line text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-500 dark:text-gray-400">
                      Select a content section from the list to edit
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Content Section"
        message={`Are you sure you want to delete "${deleteConfirm.sectionName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, sectionName: null })}
      />
    </AdminLayout>
  );
};

export default AdminContent;

