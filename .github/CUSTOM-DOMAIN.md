# Custom domain: app.openwaitlist.privoce.com

Marketing site (GitHub Pages): **openwaitlist.privoce.com**  
Full app (Vercel): **app.openwaitlist.privoce.com**

## 1. Add DNS record (HiChina / Alibaba Cloud)

Your domain `privoce.com` uses nameservers `dns19.hichina.com` / `dns20.hichina.com`.

In your DNS panel, add:

| Type  | Host / Name      | Value                 |
|-------|------------------|-----------------------|
| CNAME | `app.openwaitlist` | `cname.vercel-dns.com` |

TTL: default (10 min is fine).

## 2. Add domain in Vercel

1. Open https://vercel.com/suhan1996s-projects/openwaitlist/settings/domains
2. Click **Add** → enter `app.openwaitlist.privoce.com`
3. Wait for **Valid Configuration** (can take a few minutes after DNS propagates)

## 3. Environment variables (already set)

| Variable | Value |
|----------|-------|
| `SITE_URL` | `https://app.openwaitlist.privoce.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://app.openwaitlist.privoce.com` |

Redeploy after DNS is verified if SMS links still show the old domain.

## 4. Verify

```bash
curl -I https://app.openwaitlist.privoce.com/
```

Sample progress link: https://app.openwaitlist.privoce.com/p/waitlist/aBc12XyZ9k/
