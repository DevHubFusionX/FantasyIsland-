import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../src/config/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dumpDir = path.resolve(__dirname, '../mongodb_dump_2026-06-28T09-36-54-346Z/test');

const readJSON = (filename) => {
  const filepath = path.join(dumpDir, filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
};

const run = async () => {
  try {
    console.log('--- Starting Migration ---');

    // 1. Suites Migration
    const suites = readJSON('suites.json');
    console.log(`Found ${suites.length} suites to migrate.`);
    for (const suite of suites) {
      const docId = suite._id;
      const { _id, __v, ...data } = suite;
      const suiteDoc = doc(db, 'suites', docId);
      await setDoc(suiteDoc, {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
      });
      console.log(`[Suites] Imported suite: ${suite.title} (${docId})`);
    }

    // 2. Tiers Migration
    const tiers = readJSON('tiers.json');
    console.log(`Found ${tiers.length} tiers to migrate.`);
    for (const tier of tiers) {
      const docId = tier._id;
      const { _id, __v, ...data } = tier;
      const tierDoc = doc(db, 'tiers', docId);
      await setDoc(tierDoc, {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
      });
      console.log(`[Tiers] Imported tier: ${tier.title} (${docId})`);
    }

    // 3. Bookings Migration
    const bookings = readJSON('bookings.json');
    console.log(`Found ${bookings.length} bookings to migrate.`);
    for (const booking of bookings) {
      const docId = booking._id;
      const { _id, __v, ...data } = booking;
      const bookingDoc = doc(db, 'bookings', docId);
      await setDoc(bookingDoc, {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
        checkInDate: data.checkInDate ? new Date(data.checkInDate).toISOString() : new Date().toISOString(),
      });
      console.log(`[Bookings] Imported booking: Guest ${booking.guestName} (${docId})`);
    }

    // 4. Admins Migration
    const admins = readJSON('admins.json');
    console.log(`Found ${admins.length} admins to migrate for reference.`);
    for (const admin of admins) {
      const docId = admin._id;
      const { _id, __v, ...data } = admin;
      const adminDoc = doc(db, 'admins', docId);
      await setDoc(adminDoc, {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
      });
      console.log(`[Admins] Imported admin profile: ${admin.username} (${docId})`);
    }

    // 5. Settings Migration
    const settingsList = readJSON('settings.json');
    console.log(`Found ${settingsList.length} settings records. Consolidating...`);
    const dataObj = {};
    const rawList = [];

    for (const setting of settingsList) {
      const { _id, __v, ...cleanSetting } = setting;
      if (cleanSetting.key) {
        dataObj[cleanSetting.key] = cleanSetting.value || '';
      }
      rawList.push(cleanSetting);
    }

    const settingsDoc = doc(db, 'settings', 'global');
    await setDoc(settingsDoc, {
      data: dataObj,
      raw: rawList,
      updatedAt: new Date().toISOString()
    });
    console.log('[Settings] Imported global settings successfully.');

    console.log('--- Migration Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

run();
