# AirSquad.pl - Web Application Implementation Guide

## Project Completion Summary

Successfully transformed the static www.airsquad.pl website into a fully functional web application with admin panel, public pages, store integration, and social media features.

---

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase PostgreSQL with Row-Level Security
- **Authentication**: Supabase Auth (admin login)
- **Storage**: Vercel Blob (for images)
- **Design**: Custom color scheme (Orange #FF6B35 primary, Teal #4ECDC4 accent)

---

## Architecture Overview

### Database Schema (9 Tables)

1. **locations** - Training facility locations across 7 cities
2. **trainers** - Trainer profiles with specializations
3. **training_types** - Types of classes (akrobatyka, tricking, skoki, etc.)
4. **training_sessions** - Weekly class schedule with location, trainer, times
5. **camps** - Summer/winter camps with registration
6. **products** - Store merchandise (clothing, accessories)
7. **orders** - Customer orders (no online payment, cash on pickup)
8. **content_blocks** - Dynamic content for pages (JSONB)
9. **instagram_posts** - Manual Instagram feed management

---

## Project Structure

### Public Pages

```
/                     → Homepage with hero, features, stats
/grafik              → Interactive schedule with filters
/lokalizacje          → Locations map and info
/trenerzy            → Trainer profiles
/obozy               → Camps catalog
/sklep               → Product store with cart
/media               → Instagram feed + YouTube videos
/kontakt             → Contact form
```

### Admin Panel

```
/admin                       → Dashboard with stats
/admin/login                 → Admin authentication
/admin/lokalizacje           → Manage locations (CRUD)
/admin/trenerzy              → Manage trainers (CRUD)
/admin/produkty              → Manage products (CRUD)
/admin/zamowienia            → View and manage orders
/admin/instagram             → Manage Instagram posts
/admin/typy-zajec            → Manage training types
/admin/grafik                → Manage class schedule
/admin/obozy                 → Manage camps
```

### Components Structure

```
components/
├── layout/
│   ├── header.tsx           → Navigation with logo
│   └── footer.tsx           → Footer with links
├── home/
│   ├── hero-section.tsx     → Hero banner
│   ├── training-types-section.tsx
│   ├── locations-section.tsx
│   ├── camps-section.tsx
│   └── cta-section.tsx
├── admin/
│   ├── admin-sidebar.tsx    → Admin navigation
│   ├── admin-header.tsx     → Admin top bar
│   ├── data-table.tsx       → Reusable table component
└── integrations/
    ├── instagram-feed.tsx   → Instagram posts display
    └── youtube-section.tsx  → YouTube embedded videos
```

---

## Key Features Implemented

### 1. Admin Panel
- Simple password-based login (expandable to multiple users)
- Full CRUD operations for all entities
- Order management dashboard
- Instagram feed management
- Real-time data with RLS policies

### 2. Store System
- Product catalog with categories (clothing, accessories, other)
- Shopping cart with localStorage persistence
- Order form with customer details
- No online payment (cash on trainer pickup)
- Order tracking (pending → confirmed → ready → completed)

### 3. Public Features
- Responsive homepage with compelling branding
- Interactive class schedule with filters
- Location showcase with map URLs
- Trainer profiles with specializations
- Camp registry with featured camps
- Contact form
- Instagram feed integration
- YouTube video embeds

### 4. Security & Data
- Row-Level Security (RLS) on all tables
- Public read access for most data
- Authenticated write access for admin
- Public order insertion allowed
- Middleware protection for admin routes

---

## Setup & Deployment

### Prerequisites
1. Supabase project created and connected
2. Environment variables configured (handled by v0)
3. Database tables and migrations executed

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Local Development
```bash
npm install
npm run dev
```

### Deploy to Vercel
```bash
git push  # Connects to your GitHub repo
# Vercel automatically deploys on push
```

---

## Admin Credentials

**Note**: Currently configured with simple password authentication. Update in `/app/admin/login/page.tsx`:

```typescript
const ADMIN_PASSWORD = 'your-secure-password'
```

To add multiple users with roles, implement proper Supabase Auth.

---

## Data Management

### Adding Initial Data

Use the admin panel to add:
1. **Locations** - 7 facilities across region
2. **Trainers** - 4 primary trainers
3. **Training Types** - 5 class types pre-seeded
4. **Products** - 5 sample products pre-seeded
5. **Classes** - Use schedule page to add weekly sessions
6. **Camps** - 2 sample camps pre-seeded

### Content Blocks

Dynamic page content is stored in `content_blocks` table:
- `home.hero` - Homepage hero text and CTA
- `home.about` - About section
- `home.stats` - Statistics display

Edit via admin panel or Supabase dashboard.

---

## Integration Points

### 1. Instagram Feed
- Manually managed in admin panel
- Images uploaded to image URL field
- Links to Instagram posts
- 6-12 posts displayed on homepage/media page

### 2. YouTube Videos
- Currently hardcoded in `/components/integrations/youtube-section.tsx`
- Replace video IDs with your content
- Responsive iframe embeds

### 3. Contact Form
- Sends to `/api/contact` endpoint
- Currently logs to console
- Ready for email service integration (SendGrid, Resend, etc.)

---

## Customization Guide

### Colors
Update in `/app/globals.css`:
```css
--primary: oklch(0.65 0.2 35);        /* Orange #FF6B35 */
--accent: oklch(0.7 0.12 195);        /* Teal #4ECDC4 */
```

### Fonts
- Display: Bebas Neue (headings)
- Body: Inter (regular text)
Update in `/app/layout.tsx`

### Phone Numbers & Contact
- Update footer: `/components/layout/footer.tsx`
- Update contact page: `/app/kontakt/page.tsx`
- Update admin dashboard: `/app/admin/page.tsx`

### Social Media Links
- Update footer social links
- Add your Instagram, Facebook, YouTube URLs

---

## Performance Optimizations

1. **Image Optimization** - Use Vercel Blob for CDN delivery
2. **Database Queries** - RLS policies enable selective fetching
3. **Caching** - Supabase real-time features
4. **Code Splitting** - Next.js App Router automatic splitting
5. **Middleware** - Route protection with minimal overhead

---

## Security Considerations

1. **Admin Access** - Currently password-based; upgrade to Supabase Auth roles
2. **Order Data** - Contains customer PII; never expose in client code
3. **RLS Policies** - Enforce data access rules at database level
4. **CORS** - Configure for specific origins if needed
5. **Email Validation** - Add on contact and order forms

---

## Next Steps & Enhancements

### Phase 2 (Future)
- Email notifications (SendGrid/Resend)
- SMS alerts for orders
- Payment gateway integration
- Student progress tracking
- Parent portal
- Blog/news section
- Advanced scheduling
- Waitlist management

### Maintenance
- Regular database backups (Supabase handles)
- Monitor admin access logs
- Update product inventory
- Refresh Instagram posts
- Update class schedule
- Monitor contact form submissions

---

## Support & Troubleshooting

### Common Issues

**Admin login not working**
- Check password in `/app/admin/login/page.tsx`
- Verify Supabase connection in browser console
- Check middleware.ts for route protection

**Products not showing in store**
- Verify `is_active = true` in database
- Check image URLs are valid
- Ensure prices are set

**Instagram feed empty**
- Add posts via admin panel
- Verify `is_active = true`
- Check image URLs are accessible

**Orders not saving**
- Check Supabase connection
- Verify RLS policies allow public insert
- Check browser console for errors

---

## File Structure Reference

Key files to modify for customization:

- `/app/layout.tsx` - Global metadata and fonts
- `/app/globals.css` - Colors and design tokens
- `/components/layout/header.tsx` - Navigation and logo
- `/components/layout/footer.tsx` - Contact info and links
- `/app/admin/login/page.tsx` - Admin password
- `/app/admin/page.tsx` - Dashboard content
- `/lib/types/database.ts` - TypeScript types for database

---

## Deployment Checklist

- [ ] Update admin password
- [ ] Configure email service for contact form
- [ ] Add real Instagram posts
- [ ] Update YouTube video IDs
- [ ] Set correct phone numbers
- [ ] Configure social media links
- [ ] Add hero image
- [ ] Test all form submissions
- [ ] Verify RLS policies
- [ ] Set up analytics (Vercel Analytics)
- [ ] Configure domain DNS
- [ ] Enable HTTPS redirect

---

**Project Status**: Complete MVP ready for deployment and customization.
**Last Updated**: April 2026
**Built with**: v0.app + Next.js 15 + Supabase
