import { PlaywrightCrawler, Dataset } from 'crawlee';
import fs from 'fs';
import path from 'path';

// List of target business websites you want the AI to scrape for emails
const TARGET_WEBSITES = [
  'https://www.google.com/search?q=auto+detailing+miami+contact+email',
  // You can paste direct business URLs here too:
  // 'https://somelocalplumber.com',
];

// Regex to find email addresses on pages
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

async function runScraper() {
  console.log("🕷️ Starting Autonomous Lead Scraper (Crawlee)...");
  const extractedLeads = [];
  const foundEmails = new Set();

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 20, // Keep it small for safety
    async requestHandler({ page, request, log }) {
      log.info(`Scraping ${request.url}...`);
      
      // Get all text on the page
      const textContent = await page.evaluate(() => document.body.innerText);
      
      // Find emails using regex
      const emails = textContent.match(emailRegex) || [];
      
      for (const email of emails) {
        // Filter out obvious fake/system emails
        if (!email.includes('sentry') && !email.includes('wix') && !foundEmails.has(email)) {
          foundEmails.add(email);
          log.info(`🎯 Found email: ${email}`);
          
          extractedLeads.push({
            businessName: "Local Business", // In a more complex setup, we'd extract the `<title>`
            niche: "Home Services",
            email: email
          });
        }
      }
      
      // If we are on a search page, let's also grab some links and enqueue them
      const links = await page.$$eval('a', as => as.map(a => a.href));
      for (const link of links) {
        if (link.includes('contact') || link.includes('about')) {
          await crawler.addRequests([link]);
        }
      }
    },
    failedRequestHandler({ request, log }) {
      log.error(`Request ${request.url} failed too many times.`);
    },
  });

  await crawler.run(TARGET_WEBSITES);

  console.log(`\n✅ Scraping complete! Found ${extractedLeads.length} unique emails.`);
  
  // Save to leads.json for the Sales Agent
  if (extractedLeads.length > 0) {
    const leadsPath = path.resolve(process.cwd(), 'scripts/leads.json');
    fs.writeFileSync(leadsPath, JSON.stringify(extractedLeads, null, 2));
    console.log(`💾 Leads successfully saved to ${leadsPath}. Ready for the Sales Agent!`);
  } else {
    console.log("⚠️ No emails found. Try adding direct business URLs to TARGET_WEBSITES.");
  }
}

runScraper();
