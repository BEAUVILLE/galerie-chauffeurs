"""Nazir SEO V1: regression checks. Run: python3 -m unittest discover -s tests -v"""
import unittest
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
URL = "https://galerie-chauffeurs.digiylyfe.com/nazir-driver.html"

class NazirSEOTests(unittest.TestCase):
    def test_public_profile(self):
        html = (ROOT / "nazir-driver.html").read_text()
        self.assertIn('<link rel="canonical" href="' + URL + '">', html)
        self.assertIn('name="robots" content="index,follow', html)
        self.assertIn("nazir-driver-card.svg", html)
        self.assertIn("https://wa.me/221778310298", html)
        self.assertNotIn("gestion.html", html)

    def test_gallery_link(self):
        html = (ROOT / "index.html").read_text()
        self.assertIn('href="/nazir-driver.html"', html)

    def test_sitemap(self):
        root = ET.parse(ROOT / "sitemap.xml").getroot()
        locations = [n.text for n in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
        self.assertEqual(locations.count(URL), 1)

if __name__ == "__main__":
    unittest.main()
