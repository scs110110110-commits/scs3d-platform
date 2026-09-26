# Müşteri çekme — SCS3D (yerel 3D baskı stüdyosu)

Bu bir SaaS ürünü değil. Model: yerel hizmet + katalog + WhatsApp/email lead.
Hedef: Kitchener–Waterloo / Ontario’da arama + reklam ile sipariş.

## 1) Google Business Profile (ücretsiz, en kritik)
1. https://business.google.com → işletme oluştur
2. Kategori: 3D printing service / Custom manufacturer
3. Adres / hizmet alanı: Kitchener, Waterloo, Cambridge
4. Fotoğraf: ürünler, litofan, controller stand, atölye
5. Website: https://www.scs3d.com
6. WhatsApp numarasını ekle
7. “3D printing Kitchener”, “custom lithophane”, “personalized gifts Waterloo” gibi hizmetler ekle

## 2) Google Search Console (ücretsiz SEO)
1. https://search.google.com/search-console
2. Property: https://www.scs3d.com
3. DNS veya HTML meta ile doğrula
4. Sitemap gönder: https://www.scs3d.com/sitemap.xml
5. URL Inspection → ana sayfa + /custom + /solutions “Request indexing”

## 3) Google Analytics 4
1. analytics.google.com → yeni property (Canada)
2. Web stream → Measurement ID `G-XXXX`
3. Vercel → Environment Variables → Production:
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXX
4. Redeploy
5. Realtime’da siteyi açıp görüldüğünü kontrol et

## 4) Google Ads (ücretli trafik)
1. ads.google.com → hesap (CAD, Canada)
2. Kampanya tipi: Search
3. Konum: Kitchener–Waterloo (+30 km) — önce dar tut
4. Dil: English
5. Bütçe başlangıç: $10–20 CAD / gün
6. Anahtar kelimeler (örnek):
   - 3d printing kitchener
   - 3d printing waterloo
   - custom 3d print ontario
   - personalized night lamp
   - custom pen holder gift
   - lithophane lamp canada
7. Landing page: /custom veya ilgili ürün
8. Conversion:
   - WhatsApp click
   - Custom form email send
9. Vercel env:
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXX
   NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL=xxxxx
   NEXT_PUBLIC_GOOGLE_ADS_EMAIL_LABEL=yyyyy
10. Redeploy → Ads’te “Tag is active” doğrula

## 5) Organik içerik / sosyal (ücretsiz–ucuz)
- Instagram / TikTok: litofan yanıp sönme, custom isimli ürün
- Her postta scs3d.com + “DM for custom”
- Facebook Marketplace / Kijiji KW: “Custom 3D print”
- Yerel gruplar: UW / Conestoga / KW Buy&Sell

## 6) Sitede hazır olanlar
- SEO title/description + LocalBusiness schema
- sitemap.xml / robots.txt
- WhatsApp + email lead → GA `generate_lead` event
- Google Ads conversion hook (label env ile)
- Admin Analytics (sayfa görüntüleme)

## 7) Yapma (şimdilik)
- Ulusal geniş Ads (pahalı, düşük dönüşüm)
- SaaS abonelik modeli (yanlış fit)
- Çok fazla anahtar kelime / markasız “3d printing” tek başına
