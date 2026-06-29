import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { getDb } from '../config/firebase';

// Helper to convert a File to a base64 data URL
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to upload a file via Vercel serverless function → Cloudinary
export const uploadFile = async (file, path) => {
  if (!file) return null;

  const base64 = await fileToBase64(file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: base64,
      folder: path || 'fantasy-island/suites',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Image upload failed');
  }

  const data = await res.json();
  return data.secure_url;
};

// --- SUITES SERVICE ---
export const getSuites = async () => {
  const db = await getDb();
  const querySnapshot = await getDocs(collection(db, 'suites'));
  return querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  }));
};

export const createSuite = async (formDataObj) => {
  // formDataObj contains suite details
  let mainImageUrl = '';
  if (formDataObj.img instanceof File) {
    mainImageUrl = await uploadFile(formDataObj.img, 'suites/main');
  } else if (typeof formDataObj.img === 'string') {
    mainImageUrl = formDataObj.img;
  }

  const galleryUrls = [];
  if (formDataObj.gallery && formDataObj.gallery.length > 0) {
    for (const file of formDataObj.gallery) {
      if (file instanceof File) {
        const url = await uploadFile(file, 'suites/gallery');
        galleryUrls.push(url);
      }
    }
  }

  const suiteData = {
    title: formDataObj.title,
    price: Number(formDataObj.price),
    icon: formDataObj.icon || 'Shield',
    maxDays: Number(formDataObj.maxDays) || 3,
    features: formDataObj.features || [],
    img: mainImageUrl,
    gallery: galleryUrls,
    createdAt: new Date().toISOString()
  };

  const db = await getDb();
  const docRef = await addDoc(collection(db, 'suites'), suiteData);
  return { success: true, data: { _id: docRef.id, ...suiteData } };
};

export const updateSuite = async (id, formDataObj) => {
  let mainImageUrl = formDataObj.img;
  if (formDataObj.img instanceof File) {
    mainImageUrl = await uploadFile(formDataObj.img, 'suites/main');
  }

  // Handle gallery
  const newGalleryUrls = [];
  if (formDataObj.gallery && formDataObj.gallery.length > 0) {
    for (const file of formDataObj.gallery) {
      if (file instanceof File) {
        const url = await uploadFile(file, 'suites/gallery');
        newGalleryUrls.push(url);
      }
    }
  }

  // Combine existing gallery URLs (that were kept) with new uploads
  const finalGallery = [...(formDataObj.existingGallery || []), ...newGalleryUrls];

  const updates = {
    title: formDataObj.title,
    price: Number(formDataObj.price),
    icon: formDataObj.icon,
    maxDays: Number(formDataObj.maxDays) || 3,
    features: formDataObj.features,
    img: mainImageUrl || '',
    gallery: finalGallery
  };

  const db = await getDb();
  const docRef = doc(db, 'suites', id);
  await updateDoc(docRef, updates);
  return { success: true, data: { _id: id, ...updates } };
};

export const deleteSuite = async (id) => {
  const db = await getDb();
  const docRef = doc(db, 'suites', id);
  await deleteDoc(docRef);
  return { success: true };
};

// --- BOOKINGS SERVICE ---
export const getBookings = async () => {
  const db = await getDb();
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  }));
};

export const getBookingsByEmail = async (email) => {
  const db = await getDb();
  const q = query(
    collection(db, 'bookings'), 
    where('email', '==', email.trim().toLowerCase()),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  }));
  return { success: true, data };
};

export const createBooking = async (bookingData) => {
  const finalData = {
    ...bookingData,
    email: bookingData.email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
  };
  const db = await getDb();
  const docRef = await addDoc(collection(db, 'bookings'), finalData);
  return { success: true, data: { _id: docRef.id, ...finalData } };
};

export const updateBooking = async (id, updates) => {
  const db = await getDb();
  const docRef = doc(db, 'bookings', id);
  await updateDoc(docRef, updates);
  return { success: true, data: { _id: id, ...updates } };
};

export const deleteBooking = async (id) => {
  const db = await getDb();
  const docRef = doc(db, 'bookings', id);
  await deleteDoc(docRef);
  return { success: true };
};

// --- TIERS SERVICE ---
export const getTiers = async () => {
  const db = await getDb();
  const querySnapshot = await getDocs(collection(db, 'tiers'));
  const tiers = querySnapshot.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  }));
  return { success: true, data: tiers };
};

export const createTier = async (tierData) => {
  const finalData = {
    ...tierData,
    price: Number(tierData.price),
    order: Number(tierData.order) || 0
  };
  const db = await getDb();
  const docRef = await addDoc(collection(db, 'tiers'), finalData);
  return { success: true, data: { _id: docRef.id, ...finalData } };
};

export const updateTier = async (id, updates) => {
  const finalData = {
    ...updates,
    price: Number(updates.price),
    order: Number(updates.order) || 0
  };
  const db = await getDb();
  const docRef = doc(db, 'tiers', id);
  await updateDoc(docRef, finalData);
  return { success: true, data: { _id: id, ...finalData } };
};

export const deleteTier = async (id) => {
  const db = await getDb();
  const docRef = doc(db, 'tiers', id);
  await deleteDoc(docRef);
  return { success: true };
};

// --- SETTINGS SERVICE ---
const defaultLabels = {
  bank_name: 'Bank Name',
  beneficiary_name: 'Beneficiary Name',
  account_number: 'Account Number',
  routing_number: 'Routing Number',
  bitcoin_address: 'Bitcoin Address',
  paypal_client_id: 'PayPal Client ID'
};

const defaultSettings = {
  bank_name: 'Sanctuary International Bank',
  beneficiary_name: 'Fantasy Island Holdings Ltd',
  account_number: 'FI-9983-2003-8819',
  routing_number: 'SIB-008912',
  bitcoin_address: 'bc1qfantasyislandsecretaddressxyz',
  paypal_client_id: 'sb' // Sandbox default
};

export const getSettings = async () => {
  const db = await getDb();
  const docRef = doc(db, 'settings', 'global');
  const docSnap = await getDoc(docRef);
  
  let settingsData = defaultSettings;
  if (docSnap.exists()) {
    settingsData = { ...defaultSettings, ...docSnap.data() };
  } else {
    // Save defaults
    await setDoc(docRef, defaultSettings);
  }
  
  return {
    success: true,
    data: settingsData,
    raw: Object.keys(settingsData).map(key => ({
      key,
      value: settingsData[key],
      label: defaultLabels[key] || key.replace('_', ' ')
    }))
  };
};

export const updateSettings = async (settingsData) => {
  const db = await getDb();
  const docRef = doc(db, 'settings', 'global');
  await setDoc(docRef, settingsData, { merge: true });
  return { success: true };
};
