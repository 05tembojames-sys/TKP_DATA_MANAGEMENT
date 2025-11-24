<template>
  <div class="success-stories">
    <!-- DHIS2 Top Header -->
    <TopHeader />

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1><i class="fas fa-heart"></i> Success Stories</h1>
          <p>Inspiring stories of hope, transformation, and resilience</p>
        </div>
        <div class="header-actions">
          <button v-if="canCreateStory" class="btn-primary" @click="openCreateModal">
            <i class="fas fa-plus"></i> Create Story
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <button 
          :class="['tab', { active: currentFilter === 'all' }]"
          @click="currentFilter = 'all'"
        >
          All Stories
        </button>
        <button 
          :class="['tab', { active: currentFilter === 'published' }]"
          @click="currentFilter = 'published'"
        >
          Published
        </button>
        <button 
          :class="['tab', { active: currentFilter === 'draft' }]"
          @click="currentFilter = 'draft'"
        >
          Drafts
        </button>
        <button 
          :class="['tab', { active: currentFilter === 'sponsored' }]"
          @click="currentFilter = 'sponsored'"
        >
          Sponsored
        </button>
      </div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search stories..."
        />
      </div>
    </div>

    <!-- Stories Grid -->
    <div class="stories-container">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading success stories...</p>
      </div>

      <div v-else-if="filteredStories.length === 0" class="empty-state">
        <i class="fas fa-book-open"></i>
        <h3>No Stories Found</h3>
        <p>Start creating inspiring success stories to share with supporters.</p>
        <button v-if="canCreateStory" class="btn-primary" @click="openCreateModal">
          <i class="fas fa-plus"></i> Create First Story
        </button>
      </div>

      <div v-else class="stories-grid">
        <div 
          v-for="story in filteredStories" 
          :key="story.id"
          class="story-card"
          @click="viewStory(story)"
        >
          <div class="story-image">
            <img :src="story.blurredImageUrl || story.imageUrl" :alt="story.childName" />
            <div class="story-badge" :class="story.status">{{ story.status }}</div>
            <div v-if="story.sponsored" class="sponsored-badge">
              <i class="fas fa-heart"></i> Sponsored
            </div>
          </div>
          <div class="story-content">
            <h3>{{ story.title }}</h3>
            <p class="story-excerpt">{{ truncateText(story.story, 120) }}</p>
            <div class="story-meta">
              <span class="meta-item">
                <i class="fas fa-calendar"></i> {{ formatDate(story.createdAt) }}
              </span>
              <span class="meta-item">
                <i class="fas fa-eye"></i> {{ story.views || 0 }} views
              </span>
            </div>
            <div class="story-actions">
              <button class="btn-view" @click.stop="viewStory(story)">
                <i class="fas fa-eye"></i> View
              </button>
              <button v-if="canEditStory" class="btn-edit" @click.stop="editStory(story)">
                <i class="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Story Modal -->
    <div v-if="showStoryModal" class="modal-overlay" @click="closeStoryModal">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Edit Success Story' : 'Create Success Story' }}</h3>
          <button class="close-btn" @click="closeStoryModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveStory">
            <!-- Story Title -->
            <div class="form-group">
              <label>Story Title <span class="required">*</span></label>
              <input 
                v-model="storyForm.title" 
                type="text" 
                class="form-control" 
                placeholder="e.g., From Streets to Scholar"
                required
              />
            </div>

            <!-- Child's Details -->
            <div class="form-row three-col">
              <div class="form-group">
                <label>Child's First Name <span class="required">*</span></label>
                <input 
                  v-model="storyForm.childName" 
                  type="text" 
                  class="form-control" 
                  placeholder="e.g., Grace"
                  required
                />
              </div>
              <div class="form-group">
                <label>Date of Birth</label>
                <input 
                  v-model="storyForm.dateOfBirth" 
                  type="date" 
                  class="form-control" 
                />
              </div>
              <div class="form-group">
                <label>Age (Auto-calc if DOB set)</label>
                <input 
                  v-model="storyForm.age" 
                  type="number" 
                  class="form-control" 
                  placeholder="e.g., 14"
                  min="1"
                  max="25"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Gender</label>
                <select v-model="storyForm.gender" class="form-control">
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Program Area</label>
                <select v-model="storyForm.programArea" class="form-control">
                  <option value="">Select Program</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Protection">Protection</option>
                  <option value="Livelihoods">Livelihoods</option>
                </select>
              </div>
            </div>

            <!-- Photo Upload with Auto-Blur -->
            <div class="form-group">
              <label>
                Photo Upload <span class="required">*</span>
                <span class="privacy-note">
                  <i class="fas fa-shield-alt"></i> Face will be automatically blurred for privacy
                </span>
              </label>
              <div class="photo-upload-area">
                <input 
                  ref="photoInput"
                  type="file" 
                  accept="image/*"
                  @change="handlePhotoUpload"
                  style="display: none;"
                />
                
                <div v-if="!storyForm.imageUrl" class="upload-placeholder" @click="triggerPhotoUpload">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload photo</p>
                  <small>Recommended: 800x600px or larger</small>
                </div>

                <div v-else class="photo-preview">
                  <div class="preview-images">
                    <div class="preview-item">
                      <img :src="storyForm.imageUrl" alt="Original" />
                      <p>Original Photo</p>
                    </div>
                    <div class="preview-arrow">
                      <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="preview-item">
                      <img :src="storyForm.blurredImageUrl" alt="Blurred" />
                      <p>Privacy Protected (Auto-blurred)</p>
                      <span class="blur-badge"><i class="fas fa-check-circle"></i> Face Blurred</span>
                    </div>
                  </div>
                  <button type="button" class="btn-change-photo" @click="triggerPhotoUpload">
                    <i class="fas fa-sync-alt"></i> Change Photo
                  </button>
                </div>
              </div>
            </div>

            <!-- Success Story Content -->
            <div class="form-group">
              <label>Success Story <span class="required">*</span></label>
              <textarea 
                v-model="storyForm.story" 
                class="form-control story-textarea" 
                rows="8"
                placeholder="Share the inspiring journey, challenges overcome, achievements, and transformation..."
                required
              ></textarea>
              <small>{{ storyForm.story.length }} / 2000 characters</small>
            </div>

            <!-- Impact & Achievements -->
            <div class="form-group">
              <label>Key Achievements</label>
              <div class="achievements-list">
                <div v-for="(achievement, index) in storyForm.achievements" :key="index" class="achievement-item">
                  <input 
                    v-model="storyForm.achievements[index]" 
                    type="text" 
                    class="form-control"
                    placeholder="e.g., Enrolled in secondary school"
                  />
                  <button type="button" class="btn-remove" @click="removeAchievement(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <button type="button" class="btn-add" @click="addAchievement">
                <i class="fas fa-plus"></i> Add Achievement
              </button>
            </div>

            <!-- Support Needed -->
            <div class="form-group">
              <label>Support Needed (Optional)</label>
              <textarea 
                v-model="storyForm.supportNeeded" 
                class="form-control" 
                rows="3"
                placeholder="Describe what kind of support would help this child continue their journey..."
              ></textarea>
            </div>

            <!-- Tags -->
            <div class="form-group">
              <label>Tags (Comma separated)</label>
              <input 
                v-model="storyForm.tags" 
                type="text" 
                class="form-control" 
                placeholder="e.g., Scholarship, STEM, Leadership"
              />
            </div>

            <!-- Status -->
            <div class="form-group">
              <label>Publication Status</label>
              <div class="radio-group">
                <label class="radio-option">
                  <input type="radio" v-model="storyForm.status" value="draft" />
                  <span>Draft (Not visible to public)</span>
                </label>
                <label class="radio-option">
                  <input type="radio" v-model="storyForm.status" value="published" />
                  <span>Published (Visible to supporters)</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button 
            v-if="isEditMode && canEditStory" 
            type="button" 
            class="btn-danger" 
            @click="deleteStory" 
            :disabled="saving"
            style="margin-right: auto;"
          >
            <i class="fas fa-trash"></i> Delete
          </button>
          <button type="button" class="btn-secondary" @click="closeStoryModal">Cancel</button>
          <button type="button" class="btn-primary" @click="saveStory" :disabled="saving">
            <i class="fas fa-save"></i> {{ saving ? 'Saving...' : 'Save Story' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Story Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeViewModal">
      <div class="modal-content modal-large view-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ viewingStory.title }}</h3>
          <div class="view-actions">
            <button class="action-btn" @click="printStory" title="Print Story">
              <i class="fas fa-print"></i>
            </button>
            <button class="action-btn" @click="shareStory(viewingStory)" title="Share Story">
              <i class="fas fa-share-alt"></i>
            </button>
            <button class="close-btn" @click="closeViewModal">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="story-view">
            <div class="story-hero-image">
              <img :src="viewingStory.blurredImageUrl || viewingStory.imageUrl" :alt="viewingStory.childName" />
              <div class="hero-overlay">
                <h2>{{ viewingStory.childName }}'s Journey</h2>
                <div class="hero-meta">
                  <span v-if="viewingStory.age" class="hero-badge"><i class="fas fa-birthday-cake"></i> {{ viewingStory.age }} Years Old</span>
                  <span v-if="viewingStory.gender" class="hero-badge"><i class="fas fa-user"></i> {{ viewingStory.gender }}</span>
                  <span v-if="viewingStory.programArea" class="hero-badge program"><i class="fas fa-layer-group"></i> {{ viewingStory.programArea }}</span>
                </div>
              </div>
            </div>

            <div class="story-body">
              <div class="story-text">
                <p>{{ viewingStory.story }}</p>
              </div>

              <div v-if="viewingStory.achievements && viewingStory.achievements.length > 0" class="achievements-section">
                <h4><i class="fas fa-trophy"></i> Key Achievements</h4>
                <ul class="achievements-display">
                  <li v-for="(achievement, index) in viewingStory.achievements" :key="index">
                    <i class="fas fa-check-circle"></i> {{ achievement }}
                  </li>
                </ul>
              </div>

              <div v-if="viewingStory.supportNeeded" class="support-section">
                <h4><i class="fas fa-hands-helping"></i> How You Can Help</h4>
                <p>{{ viewingStory.supportNeeded }}</p>
                
                <div v-if="!viewingStory.sponsored" class="sponsor-cta">
                  <button class="btn-sponsor" @click="sponsorChild(viewingStory)">
                    <i class="fas fa-heart"></i> Become a Supporter
                  </button>
                </div>
                <div v-else class="sponsored-message">
                  <i class="fas fa-heart"></i> This child is currently sponsored
                </div>
              </div>

                <div v-if="viewingStory.tags && viewingStory.tags.length > 0" class="tags-section">
                  <span v-for="tag in viewingStory.tags" :key="tag" class="story-tag">#{{ tag }}</span>
                </div>

                <div class="story-footer-meta">
                  <span><i class="fas fa-calendar"></i> Published {{ formatDate(viewingStory.createdAt) }}</span>
                  <span><i class="fas fa-eye"></i> {{ viewingStory.views || 0 }} views</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sponsorship Modal -->
    <div v-if="showSponsorModal" class="modal-overlay" @click="showSponsorModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Sponsor {{ sponsorForm.childName }}</h3>
          <button class="close-btn" @click="showSponsorModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitSponsorship">
            <div class="form-group">
              <label>Your Name <span class="required">*</span></label>
              <input v-model="sponsorForm.name" type="text" class="form-control" required placeholder="Enter your full name" />
            </div>
            <div class="form-group">
              <label>Email Address <span class="required">*</span></label>
              <input v-model="sponsorForm.email" type="email" class="form-control" required placeholder="Enter your email" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="sponsorForm.phone" type="tel" class="form-control" placeholder="Enter your phone number" />
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea v-model="sponsorForm.message" class="form-control story-textarea" rows="4" placeholder="Any specific questions or comments?"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="showSponsorModal = false">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="sponsoring">
                <i class="fas fa-paper-plane" v-if="!sponsoring"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                {{ sponsoring ? 'Sending...' : 'Send Request' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Canvas for image processing (hidden) -->
    <canvas ref="imageCanvas" style="display: none;"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TopHeader from './TopHeader.vue';
import AuthService from '../services/auth.js';
import { useToast } from '../composables/useToast.js';
import { db } from '../firebase/config.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, increment } from 'firebase/firestore';
import { storage, ID } from '../lib/appwrite.js';

const router = useRouter();
const { success, error } = useToast();

// State
const loading = ref(false);
const saving = ref(false);
const stories = ref([]);
const currentFilter = ref('all');
const searchQuery = ref('');
const showStoryModal = ref(false);
const showViewModal = ref(false);
const showSponsorModal = ref(false);
const viewingStory = ref(null);
const isEditMode = ref(false);
const photoInput = ref(null);
const imageCanvas = ref(null);
const sponsoring = ref(false);

const sponsorForm = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
  storyId: '',
  childName: ''
});

// Form data
const storyForm = ref({
  title: '',
  childName: '',
  age: null,
  dateOfBirth: '',
  gender: '',
  programArea: '',
  story: '',
  imageUrl: '',
  originalFileId: '',
  blurredImageUrl: '',
  blurredFileId: '',
  bucketId: '',
  achievements: [''],
  supportNeeded: '',
  tags: '',
  status: 'draft',
  sponsored: false,
  views: 0
});

// Permissions
const canCreateStory = computed(() => {
  const role = AuthService.getUserRoleInfo();
  return role === 'admin' || role === 'manager';
});

const canEditStory = computed(() => {
  const role = AuthService.getUserRoleInfo();
  return role === 'admin' || role === 'manager';
});

// Filtered stories
const filteredStories = computed(() => {
  let result = stories.value;

  // Filter by status
  if (currentFilter.value !== 'all') {
    if (currentFilter.value === 'sponsored') {
      result = result.filter(s => s.sponsored);
    } else {
      result = result.filter(s => s.status === currentFilter.value);
    }
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(s => 
      (s.title && s.title.toLowerCase().includes(query)) || 
      (s.childName && s.childName.toLowerCase().includes(query)) ||
      (s.programArea && s.programArea.toLowerCase().includes(query)) ||
      (s.tags && Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  return result;
});

// Load stories
const loadStories = async () => {
  loading.value = true;
  try {
    const storiesQuery = query(collection(db, 'successStories'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(storiesQuery);
    stories.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Error loading stories:', err);
    error('Failed to load success stories');
  } finally {
    loading.value = false;
  }
};

// Photo upload and blur
const triggerPhotoUpload = () => {
  photoInput.value.click();
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    error('Please upload an image file');
    return;
  }

  try {
    loading.value = true;
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID || '68f4e202003c4faca141';

    // Upload original image
    const originalFileId = ID.unique();
    const originalUpload = await storage.createFile(
      bucketId,
      originalFileId,
      file
    );
    
    const originalUrlObj = storage.getFileView(bucketId, originalUpload.$id);
    const originalUrl = originalUrlObj.href || originalUrlObj.toString();
    
    storyForm.value.imageUrl = originalUrl;
    storyForm.value.originalFileId = originalUpload.$id;
    storyForm.value.bucketId = bucketId;

    // Create blurred version
    const blurredResult = await blurFaceInImage(file, bucketId);
    storyForm.value.blurredImageUrl = blurredResult.url;
    storyForm.value.blurredFileId = blurredResult.fileId;

    success('Photo uploaded and privacy-protected successfully!');
  } catch (err) {
    console.error('Error uploading photo:', err);
    error('Failed to upload photo: ' + (err.message || 'Unknown error'));
  } finally {
    loading.value = false;
  }
};

// Blur face in image using canvas
const blurFaceInImage = async (file, bucketId) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = imageCanvas.value;
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Apply blur to face area (center-top portion - typical face location)
        const faceWidth = img.width * 0.4;
        const faceHeight = img.height * 0.3;
        const faceX = (img.width - faceWidth) / 2;
        const faceY = img.height * 0.15;
        
        // Get face region
        const imageData = ctx.getImageData(faceX, faceY, faceWidth, faceHeight);
        
        // Apply heavy blur by averaging pixels in larger blocks
        const blurRadius = 20;
        const blurredData = applyPixelation(imageData, blurRadius);
        
        // Put blurred data back
        ctx.putImageData(blurredData, faceX, faceY);
        
        // Convert to blob and upload
        canvas.toBlob(async (blob) => {
          try {
            // Create a File object from the Blob
            const blurredFile = new File([blob], `blurred_${file.name}`, { type: 'image/jpeg' });
            
            const blurredFileId = ID.unique();
            const blurredUpload = await storage.createFile(
              bucketId,
              blurredFileId,
              blurredFile
            );
            
            const blurredUrlObj = storage.getFileView(bucketId, blurredUpload.$id);
            const blurredUrl = blurredUrlObj.href || blurredUrlObj.toString();
            
            resolve({
              url: blurredUrl,
              fileId: blurredUpload.$id
            });
          } catch (err) {
            reject(err);
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Pixelation/blur effect
const applyPixelation = (imageData, blockSize) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      
      // Average color in block
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const i = ((y + by) * width + (x + bx)) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }
      
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      a = Math.floor(a / count);
      
      // Apply averaged color to block
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const i = ((y + by) * width + (x + bx)) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = a;
        }
      }
    }
  }
  
  return imageData;
};

// Achievements management
const addAchievement = () => {
  storyForm.value.achievements.push('');
};

const removeAchievement = (index) => {
  storyForm.value.achievements.splice(index, 1);
};

// Modal management
const openCreateModal = () => {
  isEditMode.value = false;
  resetForm();
  showStoryModal.value = true;
};

const closeStoryModal = () => {
  showStoryModal.value = false;
  resetForm();
};

const resetForm = () => {
  storyForm.value = {
    title: '',
    childName: '',
    age: null,
    dateOfBirth: '',
    gender: '',
    programArea: '',
    story: '',
    imageUrl: '',
    originalFileId: '',
    blurredImageUrl: '',
    blurredFileId: '',
    bucketId: '',
    achievements: [''],
    supportNeeded: '',
    tags: '',
    status: 'draft',
    sponsored: false,
    views: 0
  };
};

// Save story
const saveStory = async () => {
  if (!storyForm.value.title || !storyForm.value.childName || !storyForm.value.story) {
    error('Please fill in all required fields');
    return;
  }

  if (!storyForm.value.imageUrl) {
    error('Please upload a photo');
    return;
  }

  saving.value = true;
  try {
    const storyData = {
      ...storyForm.value,
      achievements: storyForm.value.achievements.filter(a => a.trim() !== ''),
      tags: storyForm.value.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: AuthService.getCurrentUser()?.uid || 'unknown'
    };

    if (isEditMode.value && storyForm.value.id) {
      await updateDoc(doc(db, 'successStories', storyForm.value.id), storyData);
      success('Success story updated!');
    } else {
      await addDoc(collection(db, 'successStories'), storyData);
      success('Success story created!');
    }

    closeStoryModal();
    loadStories();
  } catch (err) {
    console.error('Error saving story:', err);
    error('Failed to save success story');
  } finally {
    saving.value = false;
  }
};

// Edit story
const editStory = (story) => {
  isEditMode.value = true;
  storyForm.value = { 
    ...story,
    tags: story.tags ? story.tags.join(', ') : ''
  };
  if (!storyForm.value.achievements || storyForm.value.achievements.length === 0) {
    storyForm.value.achievements = [''];
  }
  showStoryModal.value = true;
};

// Delete story
const deleteStory = async () => {
  if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) return;
  
  saving.value = true;
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, 'successStories', storyForm.value.id));
    
    // Delete images from Storage if they exist
    if (storyForm.value.bucketId) {
      const bucketId = storyForm.value.bucketId;
      
      if (storyForm.value.originalFileId) {
        try {
          await storage.deleteFile(bucketId, storyForm.value.originalFileId);
        } catch (e) {
          console.warn('Failed to delete original image:', e);
        }
      }
      
      if (storyForm.value.blurredFileId) {
        try {
          await storage.deleteFile(bucketId, storyForm.value.blurredFileId);
        } catch (e) {
          console.warn('Failed to delete blurred image:', e);
        }
      }
    }

    success('Story deleted successfully');
    closeStoryModal();
    loadStories();
  } catch (err) {
    console.error('Error deleting story:', err);
    error('Failed to delete story');
  } finally {
    saving.value = false;
  }
};

// View story
const viewStory = async (story) => {
  viewingStory.value = story;
  showViewModal.value = true;

  // Increment view count
  try {
    await updateDoc(doc(db, 'successStories', story.id), {
      views: increment(1)
    });
    story.views = (story.views || 0) + 1;
  } catch (err) {
    console.error('Error updating view count:', err);
  }
};

const closeViewModal = () => {
  showViewModal.value = false;
  viewingStory.value = null;
};

// Sponsor child
// Sponsor child
const sponsorChild = (story) => {
  sponsorForm.value = {
    name: '',
    email: '',
    phone: '',
    message: `I am interested in sponsoring ${story.childName}.`,
    storyId: story.id,
    childName: story.childName
  };
  showSponsorModal.value = true;
};

const submitSponsorship = async () => {
  if (!sponsorForm.value.name || !sponsorForm.value.email) {
    error('Please provide your name and email.');
    return;
  }

  sponsoring.value = true;
  try {
    await addDoc(collection(db, 'sponsorship_interests'), {
      ...sponsorForm.value,
      createdAt: new Date(),
      status: 'pending'
    });
    success('Thank you! We have received your request and will contact you shortly.');
    showSponsorModal.value = false;
  } catch (err) {
    console.error('Error submitting sponsorship:', err);
    error('Failed to submit request. Please try again.');
  } finally {
    sponsoring.value = false;
  }
};

// Print Story
const printStory = () => {
  window.print();
};

// Share Story
const shareStory = async (story) => {
  const url = window.location.href; // In a real app, this would be a specific route
  try {
    await navigator.clipboard.writeText(url);
    success('Link copied to clipboard!');
  } catch (err) {
    error('Failed to copy link');
  }
};

// Utility functions
const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Load on mount
onMounted(() => {
  loadStories();
});
</script>

<style scoped>
/* Global & Layout */
.success-stories {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Page Header */
.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 32px 40px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.02em;
}

.header-left h1 i {
  color: #ef4444;
  filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.2));
}

.header-left p {
  margin: 0;
  color: #64748b;
  font-size: 1.05rem;
  font-weight: 400;
}

/* Filter Bar */
.filter-bar {
  background: white;
  padding: 0 40px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.filter-tabs {
  display: flex;
  gap: 24px;
  border-bottom: none;
  padding: 0;
  margin: 0;
}

.tab {
  padding: 20px 4px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #64748b;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  position: relative;
}

.tab:hover {
  color: #1e293b;
}

.tab.active {
  color: #2c6693;
  border-bottom-color: #2c6693;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #2c6693;
  box-shadow: 0 -2px 6px rgba(44, 102, 147, 0.3);
}

/* Search Box */
.search-box {
  position: relative;
  margin: 12px 0;
}

.search-box i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  transition: color 0.2s;
}

.search-box input {
  padding: 10px 16px 10px 44px;
  border: 1px solid #cbd5e1;
  border-radius: 99px;
  font-size: 0.95rem;
  width: 280px;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #334155;
}

.search-box input:focus {
  outline: none;
  border-color: #2c6693;
  background: white;
  width: 320px;
  box-shadow: 0 0 0 4px rgba(44, 102, 147, 0.1);
}

.search-box input:focus + i {
  color: #2c6693;
}

/* Stories Container */
/* Stories Container */
.stories-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin: 40px auto;
  max-width: 600px;
  border: 1px solid #e2e8f0;
}

.loading-state i {
  font-size: 3rem;
  color: #2c6693;
  margin-bottom: 20px;
}

.empty-state i.fa-book-open {
  font-size: 4rem;
  color: #e0e0e0;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #212121;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.empty-state p {
  color: #757575;
  font-size: 1.1rem;
  margin: 0 0 32px 0;
  max-width: 400px;
  line-height: 1.5;
}

.empty-state .btn-primary {
  padding: 12px 32px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #2b6693 0%, #1d4260 100%);
  box-shadow: 0 4px 12px rgba(43, 102, 147, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  color: white;
  border: none;
  cursor: pointer;
  width: auto;
  min-width: 200px;
}

.empty-state .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(43, 102, 147, 0.4);
}

.empty-state .btn-primary i {
  font-size: 1rem;
}

/* Stories Grid */
.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 32px;
}

.story-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.story-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.story-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.story-card:hover .story-image img {
  transform: scale(1.05);
}

.story-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.story-badge.published {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.story-badge.draft {
  background: rgba(245, 158, 11, 0.9);
  color: white;
}

.sponsored-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.story-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.story-content h3 {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.story-excerpt {
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
  flex: 1;
}

.story-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

.meta-item i {
  color: #cbd5e1;
}

.story-actions {
  display: flex;
  gap: 12px;
}

.btn-view,
.btn-edit {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
}

.btn-view {
  background: #2c6693;
  color: white;
  box-shadow: 0 2px 4px rgba(44, 102, 147, 0.2);
}

.btn-view:hover {
  background: #234f72;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(44, 102, 147, 0.3);
}

.btn-edit {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-edit:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* Photo Upload */
.photo-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: all 0.2s;
  background: #f8fafc;
  cursor: pointer;
}

.photo-upload-area:hover {
  border-color: #2c6693;
  background: #f0f9ff;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.photo-upload-area:hover .upload-placeholder i {
  color: #2c6693;
}

.upload-placeholder p {
  margin: 8px 0 4px 0;
  color: #334155;
  font-weight: 600;
  font-size: 1.1rem;
}

.upload-placeholder small {
  color: #94a3b8;
}

.photo-preview {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.preview-images {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.preview-item {
  text-align: center;
}

.preview-item img {
  width: 220px;
  height: 165px;
  object-fit: cover;
  border-radius: 12px;
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.preview-item p {
  margin: 12px 0 4px 0;
  font-size: 0.95rem;
  color: #334155;
  font-weight: 600;
}

.blur-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-arrow {
  font-size: 2rem;
  color: #cbd5e1;
}

.btn-change-photo {
  padding: 8px 16px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-change-photo:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #1e293b;
}

.privacy-note {
  color: #059669;
  font-size: 0.9rem;
  margin-left: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Achievements */
.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.achievement-item {
  display: flex;
  gap: 12px;
}

.achievement-item input {
  flex: 1;
}

.btn-remove {
  padding: 0 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-add {
  padding: 10px 20px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  font-weight: 500;
}

.btn-add:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #1e293b;
}

/* View Modal */
.view-modal .modal-body {
  padding: 0;
}

.story-hero-image {
  position: relative;
  height: 450px;
  overflow: hidden;
}

.story-hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
  padding: 60px 40px 32px;
  color: white;
}

.hero-overlay h2 {
  margin: 0 0 12px 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-age {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.95;
  font-weight: 500;
}

.story-body {
  padding: 40px;
}

.story-text p {
  color: #334155;
  line-height: 1.8;
  font-size: 1.1rem;
  margin: 0 0 32px 0;
}

.achievements-section,
.support-section {
  padding: 32px;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.achievements-section h4,
.support-section h4 {
  margin: 0 0 20px 0;
  color: #2c6693;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 700;
}

.achievements-display {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievements-display li {
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-size: 1.05rem;
  line-height: 1.5;
}

.achievements-display li:last-child {
  border-bottom: none;
}

.achievements-display i {
  color: #10b981;
  margin-top: 4px;
}

.support-section p {
  color: #475569;
  line-height: 1.7;
  margin: 0 0 24px 0;
  font-size: 1.05rem;
}

.sponsor-cta {
  text-align: center;
  padding-top: 24px;
}

.btn-sponsor {
  padding: 16px 40px;
  background: #ef4444;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
}

.btn-sponsor:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
}

.sponsored-message {
  text-align: center;
  color: #059669;
  font-weight: 600;
  padding: 20px;
  background: #ecfdf5;
  border-radius: 12px;
  border: 1px solid #d1fae5;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.story-footer-meta {
  display: flex;
  gap: 32px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.95rem;
}

.story-footer-meta span {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Form Styles */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;
  color: #1e293b;
}

.form-control:focus {
  outline: none;
  border-color: #2c6693;
  background: white;
  box-shadow: 0 0 0 4px rgba(44, 102, 147, 0.1);
}

.story-textarea {
  resize: vertical;
  min-height: 180px;
  line-height: 1.6;
}

.form-group small {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #1e293b;
}

.btn-danger {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background: #fecaca;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content.modal-large {
  max-width: 1000px;
}

@keyframes slideUp {
  from {
    transform: translateY(40px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #ef4444;
}

.modal-body {
  padding: 32px;
}

.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .stories-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .preview-images {
    flex-direction: column;
  }

  .preview-arrow {
    transform: rotate(90deg);
  }

  .story-hero-image {
    height: 300px;
  }

  .hero-overlay h2 {
    font-size: 1.75rem;
  }
  
  .filter-bar {
    padding: 16px 20px;
  }
  
  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .search-box input:focus {
    width: 100%;
  }
}

/* New Styles */
.three-col {
  grid-template-columns: 1fr 1fr 1fr;
}

.view-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #2c6693;
}

.hero-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 99px;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-badge.program {
  background: rgba(44, 102, 147, 0.9);
  border-color: rgba(255, 255, 255, 0.3);
}

.tags-section {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.story-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

/* Print Styles */
@media print {
  body * {
    visibility: hidden;
  }
  
  .view-modal,
  .view-modal * {
    visibility: visible;
  }
  
  .view-modal {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
    padding: 0;
  }

  .modal-overlay {
    background: white;
    position: absolute;
  }

  .modal-content {
    box-shadow: none;
    width: 100%;
    max-width: 100%;
    border: none;
  }

  .close-btn,
  .view-actions,
  .btn-sponsor {
    display: none !important;
  }

  .story-hero-image {
    height: 300px;
  }
}
</style>
