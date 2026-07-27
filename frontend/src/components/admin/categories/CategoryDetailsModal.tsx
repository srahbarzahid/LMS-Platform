import React from 'react';
import { X, Star, Users, BookOpen } from 'lucide-react';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any | null;
}

const CategoryDetailsModal = ({ isOpen, onClose, category }: CategoryDetailsModalProps) => {
  if (!isOpen || !category) return null;

  // Mock courses for display purposes
  const mockCourses = Array.from({ length: Math.min(category.totalCourses, 5) }).map((_, i) => ({
    id: `course-${i}`,
    title: `${category.name} Masterclass ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/${category.id}-${i}/100/80`,
    instructor: 'John Doe',
    students: Math.floor(Math.random() * 5000),
    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
    status: i % 2 === 0 ? 'Published' : 'Draft'
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-heading font-black text-heading">{category.name}</h2>
              {category.featured && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              )}
            </div>
            <p className="text-body text-sm">{category.description || 'No description provided.'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-caption">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
          <div className="p-4 rounded-xl border border-border bg-gray-50/30">
            <div className="text-xs font-bold text-caption uppercase mb-1">Total Courses</div>
            <div className="text-2xl font-black text-heading">{category.totalCourses}</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-gray-50/30">
            <div className="text-xs font-bold text-caption uppercase mb-1">Created On</div>
            <div className="text-lg font-bold text-heading">{new Date(category.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <h3 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Courses in this Category
          </h3>
          
          {category.totalCourses === 0 ? (
            <div className="text-center p-8 border border-dashed border-border rounded-xl">
              <div className="text-caption font-medium">No courses are currently assigned to this category.</div>
            </div>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-caption uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Instructor</th>
                    <th className="p-4 font-semibold">Students</th>
                    <th className="p-4 font-semibold">Rating</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={course.thumbnail} alt={course.title} className="w-12 h-8 rounded object-cover" />
                          <span className="font-bold text-heading">{course.title}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{course.instructor}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-caption">
                          <Users className="w-3.5 h-3.5" /> {course.students.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          course.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {category.totalCourses > 5 && (
                <div className="p-3 text-center border-t border-border bg-gray-50 text-sm font-medium text-caption">
                  Showing 5 of {category.totalCourses} courses
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;
