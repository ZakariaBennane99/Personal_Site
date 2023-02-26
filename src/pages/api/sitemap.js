export default function handler(req, res) {

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/xml')
    
    // Instructing the Vercel edge to cache the file
    res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600')
    
    // generate sitemap here
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
    <url>
      <loc>https://zakariabennane.com/blog</loc>
      <lastmod>2023-02-26T19:17:16+00:00</lastmod>
      <priority>1</priority>
     </url>
     <url>
      <loc>https://zakariabennane.com/projects</loc>
      <lastmod>2023-02-26T19:17:16+00:00</lastmod>
      <priority>1</priority>
     </url>
     <url>
      <loc>https://zakariabennane.com/about</loc>
      <lastmod>2023-02-26T19:17:16+00:00</lastmod>
      <priority>1</priority>
     </url>
     <url>
      <loc>https://zakariabennane.com/blog/seo-with-react</loc>
      <lastmod>2023-02-26T19:17:16+00:00</lastmod>
      <priority>1</priority>
     </url>
     <url>
      <loc>https://zakariabennane.com/blog/social-sharing-and-virality</loc>
      <lastmod>2023-02-26T19:17:16+00:00</lastmod>
      <priority>1</priority>
     </url>
     <url>
      <loc>https://zakariabennane.com/blog/summary-of-positioning</loc>
      <lastmod>2023-02-26T19:17:16+00:00</lastmod>
      <priority>1</priority>
     </url>
     <url>
      <loc>https://zakariabennane.com/blog/deploy-a-nodejs-application-with-nginx-on-your-vps-server</loc>
        <lastmod>2023-02-26T19:17:16+00:00</lastmod>
        <priority>1</priority>
      </url>
      <url>
        <loc>https://zakariabennane.com/blog/indie-makers:-how-to-dramatically-increase-your-conversion-rate</loc>
        <lastmod>2023-02-26T19:17:16+00:00</lastmod>
        <priority>1</priority>
      </url>
      <url>
        <loc>https://zakariabennane.com/blog/my-web-development-journey</loc>
        <lastmod>2023-02-26T19:17:16+00:00</lastmod>
        <priority>1</priority>
      </url>
      <url>
        <loc>https://zakariabennane.com/projects/proderto</loc>
        <lastmod>2023-02-26T19:17:16+00:00</lastmod>
        <priority>1</priority>
      </url>
    </urlset>`

  res.end(xml)
}
