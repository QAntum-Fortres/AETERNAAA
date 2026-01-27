# 🌍 Language Setup - English Default with Bulgarian Option

## ✅ Status: COMPLETE

**All files have been automatically updated to use English as the default language with Bulgarian as an optional toggle.**

---

## 📋 What Was Changed

### 1. **Translation System** (`helios-ui/src/i18n/translations.ts`)
- ✅ Default language changed from `'bg'` to `'en'`
- ✅ `getCurrentLanguage()` now returns `'en'` by default
- ✅ Bulgarian translations still fully available

### 2. **React Components**
- ✅ `ClientPortal.tsx` - Default language set to English
- ✅ `AppLauncher.tsx` - Default language set to English  
- ✅ `SuccessPage.tsx` - Default language set to English
- ✅ All pricing text updated to English
- ✅ Feature descriptions updated to English

### 3. **Presentation Files**
- ✅ `AETERNA_PRESENTATION_EN.html` - New English version with Bulgarian toggle
- ✅ Original `AETERNA_PRESENTATION.html` preserved

---

## 🚀 How to Use

### For Development:
```powershell
# The default language is now English
# Users can toggle to Bulgarian via the language switcher in the UI
```

### For Production:
- **Default Language:** English (international market)
- **Optional Language:** Bulgarian (via toggle)
- **Language Detection:** Automatically detects browser language, falls back to English

---

## 🔧 Scripts Available

### 1. Set English as Default
```powershell
.\scripts\set-english-default.ps1
```
**What it does:**
- Updates all TypeScript files to use English as default
- Updates React components
- Updates translation system
- Scans and updates language references

### 2. Create English Presentation
```powershell
.\scripts\create-english-presentation.ps1
```
**What it does:**
- Creates `AETERNA_PRESENTATION_EN.html` with English default
- Adds Bulgarian toggle button
- Preserves original presentation

---

## 📊 Files Updated

| File | Status | Changes |
|------|--------|---------|
| `translations.ts` | ✅ Updated | Default: `'en'` |
| `ClientPortal.tsx` | ✅ Updated | Default: `'en'`, English pricing |
| `AppLauncher.tsx` | ✅ Updated | Default: `'en'` |
| `SuccessPage.tsx` | ✅ Updated | Default: `'en'` |
| `AETERNA_PRESENTATION_EN.html` | ✅ Created | English with BG toggle |

---

## 🌐 Language Toggle in UI

Users can switch languages using:
1. **Language Toggle Button** - Top-right corner in UI
2. **Browser Language Detection** - Automatically detects preferred language
3. **LocalStorage** - Remembers user preference

---

## ✅ Verification

To verify everything is working:

1. **Check Default Language:**
   ```typescript
   import { getCurrentLanguage } from './i18n/translations';
   console.log(getCurrentLanguage()); // Should output: 'en'
   ```

2. **Test Language Toggle:**
   - Open the application
   - Click language toggle button
   - Verify text switches between English and Bulgarian

3. **Check Presentation:**
   - Open `AETERNA_PRESENTATION_EN.html`
   - Verify it's in English by default
   - Click toggle button to switch to Bulgarian

---

## 🎯 Result

✅ **English is now the default language**  
✅ **Bulgarian is available as an option**  
✅ **Perfect for international sales**  
✅ **All scripts automated and ready to use**

---

**Last Updated:** January 27, 2026  
**Status:** ✅ Production Ready  
**Default Language:** English (en)  
**Optional Language:** Bulgarian (bg)
