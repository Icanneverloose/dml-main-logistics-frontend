
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

const NewsArticle = () => {
  const { id } = useParams();

  const articles = {
    "1": {
      id: 1,
      title: "DML Logistics Launches Revolutionary AI-Powered Route Optimization Platform",
      excerpt: "Our groundbreaking artificial intelligence system reduces delivery times by 35% and cuts fuel consumption by 40%, setting new industry standards for sustainable logistics operations.",
      content: `
        <p>DML Logistics today announced the launch of its revolutionary AI-powered route optimization platform, marking a significant milestone in the company's commitment to technological innovation and sustainable logistics operations. This groundbreaking system represents a major advancement in delivery efficiency and environmental responsibility.</p>

        <h2>Advanced AI Technology</h2>
        <p>The new platform leverages cutting-edge machine learning algorithms and real-time data analytics to optimize delivery routes with unprecedented precision. By analyzing traffic patterns, weather conditions, vehicle capacity, and delivery priorities, the system creates the most efficient routes possible, resulting in remarkable improvements across all operational metrics.</p>

        <p>Our proprietary AI engine processes over 10 million data points daily, including historical delivery data, real-time traffic information, weather forecasts, and customer preferences. This comprehensive analysis enables the system to predict optimal delivery windows and adjust routes dynamically throughout the day.</p>

        <h2>Impressive Performance Results</h2>
        <p>Since implementation began six months ago, the AI-powered platform has delivered exceptional results that exceed industry standards:</p>
        
        <ul>
          <li><strong>35% reduction in delivery times</strong> - Customers receive their packages faster than ever before</li>
          <li><strong>40% decrease in fuel consumption</strong> - Significant cost savings and environmental benefits</li>
          <li><strong>25% improvement in on-time delivery rates</strong> - Enhanced customer satisfaction and reliability</li>
          <li><strong>50% reduction in route planning time</strong> - Increased operational efficiency for dispatch teams</li>
          <li><strong>30% decrease in vehicle wear and tear</strong> - Lower maintenance costs and extended fleet lifespan</li>
        </ul>

        <h2>Environmental Impact and Sustainability</h2>
        <p>The environmental benefits of this technology align perfectly with DML Logistics' commitment to sustainable operations. The 40% reduction in fuel consumption translates to a significant decrease in carbon emissions, supporting our goal of achieving carbon neutrality by 2027.</p>

        <p>"This AI platform represents more than just operational efficiency – it's a cornerstone of our environmental responsibility strategy," said Dr. Sarah Chen, Chief Technology Officer at DML Logistics. "By optimizing every mile our vehicles travel, we're not only improving service quality but also reducing our environmental footprint substantially."</p>
      `,
      date: "January 22, 2025",
      category: "Technology Innovation",
      image: "https://readdy.ai/api/search-image?query=Advanced%20AI%20technology%20dashboard%20for%20logistics%20route%20optimization%2C%20futuristic%20interface%20with%20real-time%20data%20analytics%2C%20modern%20blue%20and%20white%20design%20with%20digital%20maps%20and%20efficiency%20metrics&width=800&height=400&seq=news-ai-platform-detail-001&orientation=landscape",
      readTime: "8 min read",
      author: "DML Logistics Communications Team",
      tags: ["AI Technology", "Route Optimization", "Sustainability", "Innovation", "Logistics"]
    },
    "2": {
      id: 2,
      title: "DML Logistics Expands Operations to South Korea with Seoul Distribution Hub",
      excerpt: "Strategic expansion into the South Korean market with a state-of-the-art 1.5 million square foot distribution center in Seoul, serving the growing e-commerce demand in Asia-Pacific region.",
      content: `
        <p>DML Logistics proudly announces its strategic expansion into South Korea with the opening of a cutting‑edge distribution hub in Seoul. This milestone marks our commitment to serving the rapidly growing Asia‑Pacific logistics market and establishing DML as a leading international logistics provider.</p>

        <h2>State-of-the-Art Seoul Facility</h2>
        <p>The new 1.5 million square foot distribution center represents a $200 million investment in advanced logistics infrastructure. Located in Seoul's strategic Incheon Free Economic Zone, the facility features automated sorting systems, robotics integration, and sustainable energy solutions that position DML at the forefront of modern logistics operations.</p>

        <p>The Seoul hub is equipped with advanced temperature‑controlled storage areas, high‑speed conveyor systems, and AI‑powered inventory management that can process up to 150,000 packages daily. This capacity makes it one of the largest and most technologically advanced logistics facilities in South Korea.</p>

        <h2>Strategic Market Entry</h2>
        <p>South Korea's e‑commerce market has experienced explosive growth, with online retail sales reaching $120 billion in 2024. The country's tech‑savvy population and demand for rapid delivery services create an ideal environment for DML's premium logistics solutions.</p>

        <p>"South Korea represents a crucial market for our Asia‑Pacific expansion strategy," said Michael Thompson, CEO of DML Logistics. "The country's advanced digital infrastructure and sophisticated consumer expectations align perfectly with our technology‑driven approach to logistics excellence."</p>

        <h2>Local Partnerships and Employment</h2>
        <p>The Seoul operation has created over 2,000 local jobs and established partnerships with leading South Korean technology companies. DML has collaborated with Samsung SDS for advanced warehouse management systems and LG CNS for sustainable energy solutions.</p>

        <p>Our commitment to the local community includes comprehensive training programs for logistics professionals and partnerships with Korean universities to develop next‑generation supply chain technologies.</p>
      `,
      date: "September 15, 2025",
      category: "Global Expansion",
      image: "https://readdy.ai/api/search-image?query=Modern%20logistics%20distribution%20center%20in%20Seoul%20South%20Korea%20with%20DML%20branding%2C%20advanced%20warehouse%20facility%20with%20Korean%20cityscape%20background%2C%20professional%20architecture%20and%20loading%20docks&width=800&height=400&seq=news-south-korea-detail-001&orientation=landscape",
      readTime: "5 min read",
      author: "DML Asia-Pacific Division",
      tags: ["South Korea", "Global Expansion", "Distribution Center", "Asia-Pacific", "E-commerce"]
    },
    "3": {
      id: 3,
      title: "Advanced Anti-Fraud Security System Protects Customer Shipments",
      excerpt: "DML Logistics implements cutting-edge blockchain-based security measures and AI fraud detection to prevent package theft and ensure 99.9% secure delivery rates across all operations.",
      content: `
        <p>DML Logistics has deployed the industry's most comprehensive anti‑fraud security system, combining blockchain technology, artificial intelligence, and advanced biometric verification to protect customer shipments. This revolutionary approach has achieved a 99.9% secure delivery rate, setting new industry standards for logistics security.</p>

        <h2>Blockchain-Based Package Authentication</h2>
        <p>Every package in the DML network is now protected by blockchain technology that creates an immutable record of its journey from origin to destination. This tamper‑proof system ensures complete transparency and prevents fraudulent activities at every stage of the delivery process.</p>

        <p>The blockchain implementation includes smart contracts that automatically verify package authenticity, track custody transfers, and alert security teams to any suspicious activities. This technology has eliminated package substitution fraud and reduced theft incidents by 98%.</p>

        <h2>AI-Powered Fraud Detection</h2>
        <p>Our advanced machine learning algorithms analyze millions of data points to identify potential fraud patterns in real‑time. The system monitors delivery routes, recipient behavior, and package handling to detect anomalies that could indicate fraudulent activity.</p>

        <p>The AI system has successfully prevented over $50 million in potential fraud losses since its implementation, protecting both DML and our customers from sophisticated fraud schemes.</p>

        <h2>Biometric Verification System</h2>
        <p>DML has introduced biometric verification for high‑value shipments, requiring fingerprint or facial recognition confirmation before package release. This system ensures that only authorized recipients can claim packages, eliminating identity fraud and unauthorized deliveries.</p>

        <p>"Security is paramount in modern logistics," said Jennifer Walsh, Chief Security Officer at DML Logistics. "Our multi‑layered approach combines the best of blockchain, AI, and biometric technologies to create an virtually impenetrable security framework."</p>
      `,
      date: "September 8, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Advanced%20security%20system%20for%20logistics%20with%20blockchain%20technology%2C%20digital%20security%20shields%20protecting%20packages%2C%20modern%20cybersecurity%20interface%20with%20fraud%20detection%20analytics&width=800&height=400&seq=news-fraud-prevention-detail-001&orientation=landscape",
      readTime: "6 min read",
      author: "DML Security Division",
      tags: ["Fraud Prevention", "Blockchain", "AI Security", "Biometric Verification", "Package Protection"]
    },
    "4": {
      id: 4,
      title: "DML Logistics Opens European Operations Center in Romania",
      excerpt: "New regional headquarters in Bucharest establishes DML as a major player in Eastern European logistics, providing comprehensive supply chain solutions across the Balkans and Central Europe.",
      content: `
        <p>DML Logistics has officially opened its European Operations Center in Bucharest, Romania, marking a significant milestone in the company's expansion across Eastern Europe. This strategic investment positions DML to serve the growing logistics demands of the Balkans and Central European markets.</p>

        <h2>Strategic Location Advantages</h2>
        <p>Bucharest's central location provides optimal access to major European markets, with direct transportation links to Germany, Italy, Turkey, and the broader European Union. The city's growing status as a regional business hub and competitive operational costs make it an ideal base for DML's European expansion.</p>

        <p>The 800,000 square foot facility features advanced automation technology, sustainable energy systems, and capacity to process 80,000 packages daily. This investment represents DML's commitment to bringing world‑class logistics services to emerging European markets.</p>

        <h2>Regional Market Opportunity</h2>
        <p>Eastern Europe's e‑commerce market is experiencing rapid growth, with online retail sales increasing by 25% annually. Romania, in particular, has seen significant digital transformation, creating substantial demand for reliable, technology‑driven logistics solutions.</p>

        <p>"Romania represents a gateway to the entire Eastern European market," said Elena Popescu, Regional Director for DML Europe. "Our Bucharest operations center will serve as the hub for expanding our services across the Balkans, Central Europe, and beyond."</p>

        <h2>Local Economic Impact</h2>
        <p>The Romanian operations have created 1,500 direct jobs and an estimated 3,000 indirect positions in the local economy. DML has partnered with Romanian universities to develop logistics education programs and invested in local supplier networks to support community development.</p>

        <p>The company has also committed to environmental sustainability, with the Bucharest facility powered entirely by renewable energy and featuring electric vehicle charging infrastructure for the local delivery fleet.</p>
      `,
      date: "August 28, 2025",
      category: "European Expansion",
      image: "https://readdy.ai/api/search-image?query=Professional%20logistics%20headquarters%20building%20in%20Bucharest%20Romania%20with%20DML%20Logistics%20signage%2C%20modern%20corporate%20architecture%20with%20European%20business%20district%20background&width=800&height=400&seq=news-romania-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML European Division",
      tags: ["Romania", "European Expansion", "Eastern Europe", "Operations Center", "Regional Hub"]
    },
    "5": {
      id: 5,
      title: "Zero-Tolerance Fraud Prevention Initiative Launches Globally",
      excerpt: "Comprehensive anti‑fraud program includes real‑time package monitoring, biometric verification, and partnership with international law enforcement to eliminate logistics‑related fraud.",
      content: `
        <p>DML Logistics has launched its comprehensive Zero‑Tolerance Fraud Prevention Initiative, a global program designed to eliminate all forms of logistics‑related fraud. This industry‑leading initiative combines advanced technology, international partnerships, and rigorous enforcement to protect customers and maintain the integrity of global supply chains.</p>

        <h2>Comprehensive Fraud Prevention Framework</h2>
        <p>The Zero‑Tolerance Initiative encompasses every aspect of the logistics process, from package pickup to final delivery. The program includes real‑time monitoring systems, predictive analytics, and immediate response protocols that can detect and prevent fraudulent activities within minutes of occurrence.</p>

        <p>Key components include 24/7 monitoring centers, rapid response teams, and direct communication channels with law enforcement agencies worldwide. This comprehensive approach has reduced fraud incidents by 99.2% across all DML operations.</p>

        <h2>International Law Enforcement Partnerships</h2>
        <p>DML has established formal partnerships with Interpol, FBI, Europol, and national law enforcement agencies in 45 countries. These collaborations enable rapid information sharing, coordinated investigations, and swift prosecution of logistics fraud perpetrators.</p>

        <p>"Fraud is not just a business problem – it's a threat to global commerce," said Robert Martinez, Director of Global Security at DML Logistics. "Our partnerships with international law enforcement ensure that fraudsters face serious consequences for their actions."</p>

        <h2>Advanced Technology Integration</h2>
        <p>The initiative leverages cutting‑edge technologies including quantum encryption, satellite tracking, and predictive AI algorithms. These systems work together to create multiple layers of protection that make fraudulent activities virtually impossible.</p>

        <p>Real‑time package monitoring provides continuous visibility, while biometric verification ensures secure handoffs at every stage of the delivery process. The integration of these technologies has created the most secure logistics network in the industry.</p>
      `,
      date: "August 20, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Global%20security%20network%20for%20logistics%20fraud%20prevention%2C%20international%20cooperation%20symbols%20with%20digital%20security%20elements%2C%20professional%20law%20enforcement%20partnership%20visualization&width=800&height=400&seq=news-zero-tolerance-detail-001&orientation=landscape",
      readTime: "5 min read",
      author: "DML Global Security Team",
      tags: ["Zero Tolerance", "Global Initiative", "Law Enforcement", "Fraud Prevention", "International Security"]
    },
    "6": {
      id: 6,
      title: "Italian Market Entry: DML Logistics Establishes Milan Distribution Network",
      excerpt: "Strategic partnership with Italian logistics providers creates comprehensive distribution network covering Northern Italy, enhancing European supply chain capabilities and customer reach.",
      content: `
        <p>DML Logistics has successfully entered the Italian market through strategic partnerships and the establishment of a comprehensive distribution network centered in Milan. This expansion strengthens DML's European operations and provides Italian businesses with access to world‑class logistics services.</p>

        <h2>Milan Distribution Hub</h2>
        <p>The new Milan facility spans 600,000 square feet and serves as the central hub for Northern Italy operations. Located in the strategic Lombardy region, the facility provides optimal access to Italy's major industrial centers and connects seamlessly with DML's broader European network.</p>

        <p>The Milan hub features state‑of‑the‑art automation technology, including robotic sorting systems and AI‑powered inventory management. With capacity to process 60,000 packages daily, the facility positions DML to serve Italy's growing e‑commerce and manufacturing sectors.</p>

        <h2>Strategic Italian Partnerships</h2>
        <p>DML has formed partnerships with leading Italian logistics companies, including Bartolini and SDA Express Courier, to create a comprehensive nationwide distribution network. These collaborations combine DML's technology and international expertise with local market knowledge and established customer relationships.</p>

        <p>"Italy represents one of Europe's most important logistics markets," said Marco Rossi, Country Manager for DML Italy. "Our partnership approach allows us to provide immediate, comprehensive coverage while respecting the strong traditions of Italian business relationships."</p>

        <h2>Market Opportunities</h2>
        <p>Italy's logistics market, valued at €95 billion annually, offers significant growth opportunities. The country's position as a gateway between Europe and the Mediterranean, combined with its strong manufacturing base, creates substantial demand for advanced logistics solutions.</p>

        <p>DML's entry into Italy includes specialized services for the fashion, automotive, and food industries – sectors where Italy maintains global leadership and requires sophisticated supply chain management.</p>
      `,
      date: "August 12, 2025",
      category: "European Expansion",
      image: "https://readdy.ai/api/search-image?query=Modern%20distribution%20center%20in%20Milan%20Italy%20with%20DML%20Logistics%20branding%2C%20Italian%20logistics%20facility%20with%20Alpine%20mountains%20background%2C%20professional%20warehouse%20architecture&width=800&height=400&seq=news-italy-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML Italian Operations",
      tags: ["Italy", "Milan", "European Expansion", "Strategic Partnerships", "Distribution Network"]
    },
    "7": {
      id: 7,
      title: "AI-Powered Fraud Detection System Prevents $50M in Potential Losses",
      excerpt: "Revolutionary machine learning algorithms identify suspicious activities in real-time, protecting customers from package theft, identity fraud, and delivery scams with 99.8% accuracy rate.",
      content: `
        <p>DML Logistics' revolutionary AI‑powered fraud detection system has successfully prevented over $50 million in potential losses since its deployment six months ago. This groundbreaking technology represents the most advanced fraud prevention system in the logistics industry, achieving an unprecedented 99.8% accuracy rate in identifying and preventing fraudulent activities.</p>

        <h2>Advanced Machine Learning Algorithms</h2>
        <p>The AI system employs sophisticated machine learning algorithms that analyze over 500 different data points for each shipment. These algorithms continuously learn from new fraud patterns, adapting in real‑time to emerging threats and maintaining effectiveness against evolving criminal tactics.</p>

        <p>The system processes millions of transactions daily, identifying subtle patterns that human analysts might miss. By analyzing delivery routes, timing patterns, recipient behavior, and payment methods, the AI can detect potential fraud with remarkable precision.</p>

        <h2>Real-Time Threat Detection</h2>
        <p>The fraud detection system operates in real‑time, providing immediate alerts when suspicious activities are detected. This rapid response capability allows DML security teams to intervene before fraudulent activities can be completed, protecting both customers and the company from financial losses.</p>

        <p>Key detection capabilities include identity verification anomalies, unusual delivery patterns, suspicious payment activities, and coordinated fraud attempts. The system has successfully identified and prevented sophisticated fraud rings operating across multiple countries.</p>

        <h2>Comprehensive Protection Coverage</h2>
        <p>The AI system protects against various types of fraud including package theft, identity fraud, payment fraud, and delivery scams. This comprehensive coverage ensures that customers can trust DML with their most valuable shipments, knowing they are protected by industry‑leading security technology.</p>

        <p>"Our AI fraud detection system represents a quantum leap in logistics security," said Dr. Amanda Foster, Chief Data Scientist at DML Logistics. "By preventing $50 million in potential losses, we've demonstrated that advanced AI can effectively protect the integrity of global supply chains."</p>
      `,
      date: "June 25, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=AI%20fraud%20detection%20dashboard%20showing%20prevented%20losses%20and%20security%20analytics%2C%20advanced%20machine%20learning%20interface%20with%20threat%20detection%20visualization%20and%20financial%20protection%20metrics&width=800&height=400&seq=news-ai-fraud-detail-001&orientation=landscape",
      readTime: "6 min read",
      author: "DML AI Security Team",
      tags: ["AI Fraud Detection", "Machine Learning", "Financial Protection", "Real-time Security", "Loss Prevention"]
    },
    "8": {
      id: 8,
      title: "Customer Identity Verification System Enhances Package Security",
      excerpt: "Multi-factor authentication and biometric verification ensure only authorized recipients receive packages, reducing fraud incidents by 95% and increasing customer confidence.",
      content: `
        <p>DML Logistics has implemented a comprehensive Customer Identity Verification System that combines multi‑factor authentication with advanced biometric verification to ensure secure package delivery. This innovative system has reduced fraud incidents by 95% while significantly enhancing customer confidence in package security.</p>

        <h2>Multi-Factor Authentication Process</h2>
        <p>The verification system requires multiple forms of identification before package release, including SMS verification codes, email confirmations, and government‑issued ID verification. This layered approach ensures that only authorized recipients can claim packages, eliminating unauthorized deliveries.</p>

        <p>For high‑value shipments, the system automatically triggers additional security measures, including real‑time photo verification and GPS location confirmation. These enhanced protocols provide maximum security for valuable or sensitive packages.</p>

        <h2>Biometric Verification Technology</h2>
        <p>DML's biometric verification system uses advanced fingerprint and facial recognition technology to confirm recipient identity. This cutting‑edge technology is integrated into delivery devices, allowing drivers to verify identity instantly at the point of delivery.</p>

        <p>The biometric system maintains the highest privacy standards, with all biometric data encrypted and stored securely. Customers have full control over their biometric information and can opt out of biometric verification while still benefiting from other security measures.</p>

        <h2>Customer Confidence and Satisfaction</h2>
        <p>Customer satisfaction surveys show a 40% increase in confidence levels regarding package security since the implementation of the identity verification system. Customers particularly appreciate the peace of mind that comes with knowing their packages are protected by multiple layers of security.</p>

        <p>"The identity verification system gives me complete confidence that my packages will only be delivered to me," said Sarah Johnson, a DML customer from Chicago. "Knowing that my identity is verified before delivery makes me feel secure about ordering valuable items online."</p>
      `,
      date: "June 18, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Biometric%20verification%20system%20for%20package%20delivery%2C%20modern%20identity%20authentication%20technology%20with%20fingerprint%20and%20facial%20recognition%2C%20secure%20delivery%20confirmation%20interface&width=800&height=400&seq=news-identity-verification-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML Customer Security Team",
      tags: ["Identity Verification", "Biometric Security", "Multi-factor Authentication", "Package Security", "Customer Confidence"]
    },
    "9": {
      id: 9,
      title: "Strategic Partnership with Global E-Commerce Giant Amazon Announced",
      excerpt: "DML Logistics becomes preferred logistics partner for Amazon's next-day delivery expansion across 15 new metropolitan areas, enhancing last-mile delivery capabilities.",
      content: `
        <p>DML Logistics has announced a groundbreaking strategic partnership with Amazon, becoming the preferred logistics partner for Amazon's ambitious next-day delivery expansion across 15 major metropolitan areas. This partnership represents a significant milestone in DML's growth strategy and validates our position as a leading logistics provider.</p>

        <h2>Partnership Scope and Coverage</h2>
        <p>The partnership covers 15 major metropolitan areas including New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose, Austin, Jacksonville, Fort Worth, Columbus, and Charlotte. DML will handle last-mile delivery operations for Amazon's next-day delivery service in these markets.</p>

        <p>This collaboration leverages DML's advanced logistics infrastructure, AI-powered route optimization, and proven track record of reliable delivery services. The partnership is expected to process over 2 million packages monthly across all covered markets.</p>

        <h2>Enhanced Delivery Capabilities</h2>
        <p>DML's advanced technology stack, including real-time tracking, predictive analytics, and automated sorting systems, will support Amazon's commitment to fast, reliable delivery. Our electric vehicle fleet and sustainable operations align with Amazon's Climate Pledge commitments.</p>

        <p>"This partnership with Amazon validates our technology-driven approach to logistics excellence," said Michael Thompson, CEO of DML Logistics. "We're excited to bring our innovative solutions to support Amazon's next-day delivery expansion and serve millions of customers across these metropolitan areas."</p>

        <h2>Investment and Infrastructure</h2>
        <p>To support this partnership, DML is investing $150 million in additional infrastructure, including new sorting facilities, expanded vehicle fleets, and enhanced technology systems. This investment will create over 3,000 new jobs across the covered metropolitan areas.</p>

        <p>The partnership also includes joint technology development initiatives focused on further improving delivery efficiency, customer experience, and environmental sustainability in last-mile logistics operations.</p>
      `,
      date: "January 20, 2025",
      category: "Strategic Partnerships",
      image: "https://readdy.ai/api/search-image?query=Professional%20business%20partnership%20handshake%20with%20e-commerce%20and%20logistics%20symbols%2C%20modern%20corporate%20meeting%20room%20with%20digital%20commerce%20elements%20and%20global%20connectivity%20graphics&width=800&height=400&seq=news-amazon-partnership-detail-001&orientation=landscape",
      readTime: "5 min read",
      author: "DML Strategic Partnerships Team",
      tags: ["Amazon Partnership", "E-commerce", "Next-day Delivery", "Strategic Alliance", "Last-mile Logistics"]
    },
    "10": {
      id: 10,
      title: "DML Logistics Achieves Carbon Neutral Certification Across All Operations",
      excerpt: "Milestone achievement in sustainability journey with 100% renewable energy adoption, electric fleet expansion, and innovative carbon offset programs making us industry leaders.",
      content: `
        <p>DML Logistics has achieved carbon neutral certification across all global operations, marking a historic milestone in the company's sustainability journey. This achievement positions DML as an industry leader in environmental responsibility and demonstrates our unwavering commitment to combating climate change.</p>

        <h2>Comprehensive Sustainability Strategy</h2>
        <p>The carbon neutral certification encompasses all aspects of DML's operations, including facilities, transportation, packaging, and supply chain activities. This comprehensive approach required a complete transformation of our operational model, investing over $500 million in sustainable technologies and practices.</p>

        <p>Key initiatives include 100% renewable energy adoption across all facilities, complete electrification of our delivery fleet, sustainable packaging solutions, and innovative carbon offset programs that support reforestation and renewable energy projects worldwide.</p>

        <h2>Electric Fleet and Renewable Energy</h2>
        <p>DML's transition to a fully electric delivery fleet represents the largest commercial electric vehicle deployment in the logistics industry. Our 5,000‑vehicle electric fleet, combined with solar‑powered charging infrastructure, eliminates over 200,000 tons of CO₂ emissions annually.</p>

        <p>All DML facilities now operate on 100% renewable energy, sourced from wind, solar, and hydroelectric power. This transition includes advanced energy storage systems and smart grid technology that optimize energy consumption and reduce waste.</p>

        <h2>Industry Leadership and Recognition</h2>
        <p>The carbon neutral certification was awarded by the Carbon Trust, following a rigorous 18‑month assessment of DML's environmental impact and sustainability practices. This certification places DML among the first major logistics companies to achieve complete carbon neutrality.</p>

        <p>"Achieving carbon neutrality is not just an environmental milestone – it's a business imperative," said Dr. Elena Rodriguez, Chief Sustainability Officer at DML Logistics. "We've proven that sustainable operations can drive efficiency, reduce costs, and create competitive advantages while protecting our planet for future generations."</p>
      `,
      date: "January 18, 2025",
      category: "Sustainability",
      image: "https://readdy.ai/api/search-image?query=Green%20sustainable%20logistics%20facility%20with%20electric%20delivery%20trucks%20and%20solar%20panels%2C%20eco-friendly%20transportation%20hub%20with%20renewable%20energy%20systems%20and%20carbon%20neutral%20certification&width=800&height=400&seq=news-carbon-neutral-detail-001&orientation=landscape",
      readTime: "6 min read",
      author: "DML Sustainability Team",
      tags: ["Carbon Neutral", "Sustainability", "Electric Fleet", "Renewable Energy", "Environmental Leadership"]
    },
    "11": {
      id: 11,
      title: "Record-Breaking Q4 2024 Performance: 5 Million Packages Delivered",
      excerpt: "DML Logistics achieves unprecedented holiday season success with 99.9% on-time delivery rate, processing over 5 million packages while maintaining exceptional service quality.",
      content: `
        <p>DML Logistics has achieved record-breaking performance during Q4 2024, successfully delivering over 5 million packages with an unprecedented 99.9% on-time delivery rate. This exceptional performance during the busiest shipping season demonstrates DML's operational excellence and commitment to customer satisfaction.</p>

        <h2>Holiday Season Excellence</h2>
        <p>The Q4 2024 holiday season presented unique challenges with package volumes increasing by 150% compared to regular periods. Despite this surge, DML maintained exceptional service quality through strategic planning, advanced technology deployment, and dedicated team efforts across all operational areas.</p>

        <p>Key performance metrics include 99.9% on-time delivery rate, 99.7% package accuracy, zero lost packages, and 98% customer satisfaction rating. These results significantly exceed industry averages and establish new benchmarks for holiday season logistics performance.</p>

        <h2>Operational Innovations</h2>
        <p>DML's success was driven by innovative operational strategies including AI-powered demand forecasting, dynamic route optimization, and real-time capacity management. These technologies enabled proactive planning and rapid response to changing conditions throughout the holiday season.</p>

        <p>The company deployed additional temporary facilities, expanded delivery windows, and implemented 24/7 operations to handle peak volumes. Advanced sorting technology and automated systems processed packages 40% faster than previous years while maintaining accuracy standards.</p>

        <h2>Customer Impact and Recognition</h2>
        <p>The exceptional Q4 performance directly benefited millions of customers who received their holiday packages on time and in perfect condition. Customer feedback highlighted DML's reliability, communication, and service quality during the critical holiday period.</p>

        <p>"Our Q4 performance demonstrates that operational excellence and customer satisfaction can be maintained even during peak demand periods," said Operations Director Lisa Chen. "This success validates our investment in technology, infrastructure, and our dedicated team members who made this achievement possible."</p>
      `,
      date: "January 15, 2025",
      category: "Company Performance",
      image: "https://readdy.ai/api/search-image?query=Busy%20modern%20logistics%20warehouse%20during%20peak%20season%20with%20automated%20sorting%20systems%2C%20packages%20moving%20on%20conveyor%20belts%2C%20efficient%20holiday%20shipping%20operations%20with%20professional%20workers&width=800&height=400&seq=news-q4-performance-detail-001&orientation=landscape",
      readTime: "5 min read",
      author: "DML Operations Team",
      tags: ["Q4 Performance", "Holiday Season", "Record Breaking", "Operational Excellence", "Customer Satisfaction"]
    },
    "12": {
      id: 12,
      title: "New State-of-the-Art Distribution Center Opens in Texas",
      excerpt: "Our largest facility to date spans 2 million square feet, featuring advanced robotics, automated sorting systems, and capacity to process 100,000 packages daily.",
      content: `
        <p>DML Logistics has officially opened its largest distribution center to date in Dallas, Texas, spanning an impressive 2 million square feet. This state-of-the-art facility represents a $300 million investment in advanced logistics infrastructure and positions DML to serve the rapidly growing Texas market with unprecedented efficiency.</p>

        <h2>Advanced Technology Integration</h2>
        <p>The Texas distribution center features cutting-edge robotics and automation technology, including 200 autonomous mobile robots, AI-powered sorting systems, and advanced conveyor networks. These systems work together to process up to 100,000 packages daily with 99.9% accuracy.</p>

        <p>The facility incorporates machine learning algorithms that optimize package flow, predict maintenance needs, and continuously improve operational efficiency. This technology integration reduces processing time by 60% compared to traditional distribution centers.</p>

        <h2>Strategic Location Benefits</h2>
        <p>Located in the Dallas‑Fort Worth metroplex, the facility provides optimal access to major Texas markets and serves as a central hub for distribution across the Southwest United States. The location offers direct access to major highways, rail networks, and air cargo facilities.</p>

        <p>The Texas facility strengthens DML's ability to provide same-day and next-day delivery services across Texas, Oklahoma, Arkansas, and Louisiana, serving a combined population of over 50 million people.</p>

        <h2>Economic Impact and Employment</h2>
        <p>The new distribution center has created 2,500 direct jobs and an estimated 5,000 indirect positions in the local economy. DML has partnered with local educational institutions to provide training programs and career development opportunities for logistics professionals.</p>

        <p>"This facility represents our commitment to the Texas market and our confidence in the region's continued growth," said Regional Director James Rodriguez. "We're proud to bring advanced logistics capabilities and quality employment opportunities to the Dallas‑Fort Worth community."</p>
      `,
      date: "January 12, 2025",
      category: "Infrastructure Expansion",
      image: "https://readdy.ai/api/search-image?query=Massive%20modern%20distribution%20center%20exterior%20with%20DML%20Logistics%20branding%2C%20state-of-the-art%20warehouse%20facility%20with%20loading%20docks%20and%20professional%20architecture%20in%20Texas%20landscape&width=800&height=400&seq=news-texas-facility-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML Infrastructure Team",
      tags: ["Texas Facility", "Distribution Center", "Infrastructure Expansion", "Advanced Technology", "Job Creation"]
    },
    "13": {
      id: 13,
      title: "DML Logistics Wins 'Logistics Innovation of the Year' Award",
      excerpt: "Industry recognition for our blockchain-based supply chain transparency platform that provides real-time visibility and enhanced security for global shipments.",
      content: `
        <p>DML Logistics has been honored with the prestigious 'Logistics Innovation of the Year' award at the International Supply Chain Excellence Awards. This recognition celebrates our groundbreaking blockchain-based supply chain transparency platform that has revolutionized package tracking and security in the logistics industry.</p>

        <h2>Blockchain Innovation Platform</h2>
        <p>The award‑winning platform leverages blockchain technology to create an immutable, transparent record of every package's journey from origin to destination. This innovation provides unprecedented visibility into supply chain operations while ensuring data integrity and security.</p>

        <p>The platform processes over 1 million transactions daily, creating a comprehensive audit trail that customers, partners, and regulatory authorities can access in real-time. This transparency has reduced disputes by 85% and improved customer confidence significantly.</p>

        <h2>Industry Impact and Recognition</h2>
        <p>The International Supply Chain Excellence Awards recognize companies that demonstrate exceptional innovation, operational excellence, and positive industry impact. DML's blockchain platform was selected from over 200 submissions by a panel of industry experts and academics.</p>

        <p>"This award validates our commitment to technological innovation and transparency in logistics operations," said Chief Technology Officer Dr. Sarah Chen. "Our blockchain platform represents a fundamental shift toward more secure, transparent, and efficient supply chain management."</p>

        <h2>Future Development Plans</h2>
        <p>Building on this recognition, DML plans to expand the blockchain platform's capabilities to include smart contracts for automated compliance, enhanced analytics for predictive insights, and integration with IoT sensors for real-time condition monitoring.</p>

        <p>The company is also exploring partnerships with other logistics providers to create an industry‑wide blockchain network that could standardize transparency and security across the global supply chain ecosystem.</p>
      `,
      date: "January 10, 2025",
      category: "Awards & Recognition",
      image: "https://readdy.ai/api/search-image?query=Professional%20awards%20ceremony%20with%20logistics%20innovation%20trophy%2C%20elegant%20corporate%20event%20setting%20with%20DML%20Logistics%20executives%20receiving%20industry%20recognition%20award&width=800&height=400&seq=news-innovation-award-detail-001&orientation=landscape",
      readTime: "3 min read",
      author: "DML Communications Team",
      tags: ["Innovation Award", "Blockchain Technology", "Industry Recognition", "Supply Chain Transparency", "Excellence Award"]
    },
    "14": {
      id: 14,
      title: "International Expansion: DML Logistics Enters European Market",
      excerpt: "Strategic expansion into 8 European countries with new hubs in London, Frankfurt, and Amsterdam, bringing our premium logistics services to European businesses.",
      content: `
        <p>DML Logistics has successfully launched operations across 8 European countries, establishing major distribution hubs in London, Frankfurt, and Amsterdam. This strategic expansion marks DML's entry into the European market and brings our advanced logistics services to businesses and consumers across the continent.</p>

        <h2>Multi-Country Launch Strategy</h2>
        <p>The European expansion covers the United Kingdom, Germany, Netherlands, France, Belgium, Switzerland, Austria, and Denmark. Each market entry was carefully planned to ensure compliance with local regulations while maintaining DML's high service standards.</p>

        <p>The three major hubs in London, Frankfurt, and Amsterdam serve as regional centers, each equipped with advanced sorting technology, automated systems, and capacity to process 50,000 packages daily. These facilities connect to create a comprehensive European distribution network.</p>

        <h2>Local Partnerships and Integration</h2>
        <p>DML has established partnerships with leading European logistics companies and technology providers to ensure seamless integration with local markets. These partnerships combine DML's innovative technology with local expertise and established customer relationships.</p>

        <p>"Europe represents a tremendous opportunity for DML's technology‑driven logistics solutions," said European Operations Director Marie Dubois. "Our expansion strategy focuses on bringing innovation while respecting local business practices and regulatory requirements."</p>

        <h2>Investment and Job Creation</h2>
        <p>The European expansion represents a $400 million investment in infrastructure, technology, and human resources. DML has created over 3,000 jobs across the 8 countries, with comprehensive training programs to ensure consistent service quality.</p>

        <p>The company has also invested in sustainable operations, with all European facilities powered by renewable energy and electric delivery vehicles deployed in major urban areas to support environmental goals.</p>
      `,
      date: "January 8, 2025",
      category: "Global Expansion",
      image: "https://readdy.ai/api/search-image?query=European%20logistics%20expansion%20map%20showing%20DML%20operations%20across%20multiple%20countries%2C%20professional%20business%20growth%20visualization%20with%20shipping%20routes%20and%20distribution%20centers&width=800&height=400&seq=news-europe-expansion-detail-001&orientation=landscape",
      readTime: "5 min read",
      author: "DML European Division",
      tags: ["European Expansion", "International Growth", "Multi-country Launch", "Strategic Partnerships", "Market Entry"]
    },
    "15": {
      id: 15,
      title: "Next-Generation Customer Portal Launches with Enhanced Features",
      excerpt: "Revolutionary customer experience platform featuring real-time GPS tracking, predictive delivery windows, photo confirmations, and AI-powered customer support chatbot.",
      content: `
        <p>DML Logistics has launched its next-generation customer portal, featuring revolutionary enhancements that transform the package tracking and customer service experience. This comprehensive platform integrates advanced technologies to provide unprecedented visibility and control over shipments.</p>

        <h2>Advanced Tracking Capabilities</h2>
        <p>The new portal features real-time GPS tracking that shows exact package location on interactive maps, predictive delivery windows that provide accurate arrival estimates, and photo confirmations that document package condition and delivery completion.</p>

        <p>Customers can now track multiple packages simultaneously, receive proactive notifications about potential delays, and access detailed delivery history with comprehensive analytics about their shipping patterns and preferences.</p>

        <h2>AI-Powered Customer Support</h2>
        <p>The portal includes an advanced AI chatbot that can handle 95% of customer inquiries instantly, providing immediate answers about tracking, delivery options, and service questions. The AI system learns from each interaction to continuously improve response accuracy and helpfulness.</p>

        <p>For complex issues, the system seamlessly transfers customers to human agents with full context about their inquiry and shipping history, ensuring efficient resolution without repetition.</p>

        <h2>Personalization and Preferences</h2>
        <p>The new platform offers extensive personalization options, allowing customers to set delivery preferences, notification schedules, and service options. Machine learning algorithms analyze usage patterns to suggest optimal shipping options and delivery times.</p>

        <p>"Our new customer portal represents a fundamental shift toward customer‑centric logistics," said Customer Experience Director Amanda Foster. "We've created a platform that not only tracks packages but anticipates customer needs and provides proactive solutions."</p>
      `,
      date: "January 5, 2025",
      category: "Product Updates",
      image: "https://readdy.ai/api/search-image?query=Modern%20customer%20portal%20interface%20showing%20advanced%20package%20tracking%20features%2C%20clean%20user%20interface%20design%20with%20GPS%20maps%2C%20delivery%20notifications%20and%20blue%20color%20scheme&width=800&height=400&seq=news-customer-portal-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML Product Development Team",
      tags: ["Customer Portal", "Product Launch", "AI Technology", "User Experience", "Digital Innovation"]
    },
    "16": {
      id: 16,
      title: "DML Logistics Invests $50M in Electric Vehicle Fleet Expansion",
      excerpt: "Major investment in sustainable transportation with 500 new electric delivery vehicles, supporting our commitment to zero-emission logistics by 2027.",
      content: `
        <p>DML Logistics has announced a $50 million investment in electric vehicle fleet expansion, adding 500 new electric delivery vehicles to support our commitment to achieving zero‑emission logistics operations by 2027. This investment represents the largest single expansion of commercial electric vehicles in the logistics industry.</p>

        <h2>Fleet Modernization Initiative</h2>
        <p>The new electric vehicles include 300 last‑mile delivery vans, 150 medium‑duty trucks for regional distribution, and 50 heavy‑duty vehicles for long‑haul transportation. These vehicles feature advanced battery technology with ranges up to 300 miles and fast‑charging capabilities.</p>

        <p>Each vehicle is equipped with telematics systems that optimize routes, monitor energy consumption, and provide real‑time performance data. This technology integration improves efficiency while reducing operational costs and environmental impact.</p>

        <h2>Charging Infrastructure Development</h2>
        <p>Alongside the vehicle investment, DML is installing 200 fast‑charging stations across its distribution centers and strategic locations. These stations use renewable energy sources and can charge vehicles to 80% capacity in under 30 minutes.</p>

        <p>The charging infrastructure includes smart grid integration that optimizes energy usage during off‑peak hours and provides grid stability services to local utilities, creating additional revenue streams while supporting renewable energy adoption.</p>

        <h2>Environmental and Economic Impact</h2>
        <p>The electric fleet expansion will eliminate over 15,000 tons of CO₂ emissions annually while reducing fuel costs by $8 million per year. This investment demonstrates that sustainable operations can deliver both environmental benefits and economic advantages.</p>

        <p>"This investment reinforces our leadership in sustainable logistics," said Chief Sustainability Officer Dr. Elena Rodriguez. "Electric vehicles are not just environmentally responsible – they're operationally superior, offering lower maintenance costs, quieter operation, and enhanced reliability."</p>
      `,
      date: "January 3, 2025",
      category: "Sustainability Investment",
      image: "https://readdy.ai/api/search-image?query=Fleet%20of%20modern%20electric%20delivery%20trucks%20with%20DML%20Logistics%20branding%2C%20clean%20white%20vehicles%20at%20charging%20stations%2C%20sustainable%20transportation%20technology%20and%20eco-friendly%20logistics&width=800&height=400&seq=news-electric-fleet-detail-001&orientation=landscape",
      readTime: "5 min read",
      author: "DML Sustainability Team",
      tags: ["Electric Vehicles", "Sustainability Investment", "Fleet Expansion", "Zero Emission", "Green Technology"]
    },
    "17": {
      id: 17,
      title: "Advanced Drone Delivery Pilot Program Launches in California",
      excerpt: "Pioneering last-mile delivery innovation with autonomous drone technology, targeting rural and hard-to-reach areas for faster, more efficient package delivery.",
      content: `
        <p>DML Logistics has launched an advanced drone delivery pilot program in California, pioneering the use of autonomous drone technology for last‑mile package delivery. This innovative program targets rural and hard‑to‑reach areas where traditional delivery methods face challenges with accessibility and efficiency.</p>

        <h2>Cutting-Edge Drone Technology</h2>
        <p>The pilot program utilizes state-of-the-art autonomous drones capable of carrying packages up to 10 pounds over distances of 15 miles. These drones feature advanced navigation systems, obstacle avoidance technology, and weather‑resistant designs that ensure safe, reliable delivery operations.</p>

        <p>Each drone is equipped with GPS tracking, real‑time video monitoring, and secure package compartments that require recipient verification before release. The technology includes redundant safety systems and emergency landing capabilities to ensure operational safety.</p>

        <h2>Service Area and Applications</h2>
        <p>The initial pilot covers 500 square miles of rural California, including mountainous regions, agricultural areas, and remote communities where traditional delivery can take hours or days. The program focuses on time‑sensitive deliveries such as medical supplies, emergency items, and high‑priority packages.</p>

        <p>Delivery times have been reduced from hours to minutes in many cases, with drones capable of completing deliveries in 30 minutes or less from dispatch. This speed improvement is particularly valuable for medical deliveries and emergency supplies.</p>

        <h2>Regulatory Compliance and Safety</h2>
        <p>DML has worked closely with the FAA to ensure full regulatory compliance and has obtained all necessary certifications for commercial drone operations. The program includes comprehensive safety protocols, pilot training, and community engagement initiatives.</p>

        <p>"Drone delivery represents the future of last‑mile logistics," said Innovation Director Dr. Michael Chang. "This pilot program demonstrates how advanced technology can solve real‑world delivery challenges while improving service quality and reducing environmental impact."</p>
      `,
      date: "December 30, 2024",
      category: "Innovation",
      image: "https://readdy.ai/api/search-image?query=Professional%20delivery%20drone%20in%20flight%20carrying%20package%20over%20California%20landscape%2C%20advanced%20autonomous%20technology%20for%20logistics%2C%20modern%20aerial%20delivery%20system%20with%20DML%20branding&width=800&height=400&seq=news-drone-delivery-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML Innovation Team",
      tags: ["Drone Delivery", "Innovation", "Last-mile Logistics", "Autonomous Technology", "Pilot Program"]
    },
    "18": {
      id: 18,
      title: "DML Logistics Partners with Leading Universities for Logistics Research",
      excerpt: "Collaborative research initiatives with MIT and Stanford focusing on supply chain optimization, sustainable logistics, and next-generation transportation technologies.",
      content: `
        <p>DML Logistics has established strategic research partnerships with MIT and Stanford University, launching collaborative initiatives focused on supply chain optimization, sustainable logistics, and next‑generation transportation technologies. These partnerships position DML at the forefront of logistics innovation and academic research.</p>

        <h2>Research Focus Areas</h2>
        <p>The partnerships encompass multiple research areas including artificial intelligence applications in logistics, sustainable transportation solutions, autonomous vehicle integration, and advanced supply chain analytics. Each university brings unique expertise and research capabilities to these collaborative projects.</p>

        <p>MIT's partnership focuses on AI and machine learning applications for route optimization and predictive analytics, while Stanford's collaboration emphasizes sustainable technology development and environmental impact reduction strategies.</p>

        <h2>Innovation Labs and Facilities</h2>
        <p>DML has established dedicated innovation labs at both universities, providing state‑of‑the‑art facilities for research and development activities. These labs include simulation environments, testing facilities, and access to DML's operational data for real‑world research applications.</p>

        <p>The partnerships also include student internship programs, graduate research opportunities, and faculty exchange initiatives that foster knowledge transfer and innovation development between academia and industry.</p>

        <h2>Expected Outcomes and Timeline</h2>
        <p>The research partnerships are expected to produce breakthrough innovations in logistics technology over the next five years. Initial projects focus on developing next‑generation route optimization algorithms and sustainable packaging solutions.</p>

        <p>"These partnerships represent our commitment to advancing the entire logistics industry through research and innovation," said Chief Technology Officer Dr. Sarah Chen. "By collaborating with leading academic institutions, we're investing in the future of logistics technology and sustainable transportation solutions."</p>
      `,
      date: "December 28, 2024",
      category: "Research & Development",
      image: "https://readdy.ai/api/search-image?query=University%20research%20laboratory%20with%20logistics%20technology%20development%2C%20students%20and%20professors%20working%20on%20supply%20chain%20innovation%20projects%2C%20academic%20partnership%20in%20modern%20research%20facility&width=800&height=400&seq=news-university-partnership-detail-001&orientation=landscape",
      readTime: "4 min read",
      author: "DML Research Team",
      tags: ["University Partnership", "Research & Development", "Academic Collaboration", "Innovation", "Technology Development"]
    }
  };

  const article = articles[id as string] || articles["1"];

  const relatedArticles = [
    {
      id: 2,
      title: "DML Logistics Expands Operations to South Korea with Seoul Distribution Hub",
      excerpt: "Strategic expansion into the South Korean market with a state-of-the-art 1.5 million square foot distribution center in Seoul.",
      date: "September 15, 2025",
      category: "Global Expansion",
      image: "https://readdy.ai/api/search-image?query=Modern%20logistics%20distribution%20center%20in%20Seoul%20South%20Korea%20with%20DML%20branding%2C%20advanced%20warehouse%20facility%20with%20Korean%20cityscape%20background&width=300&height=200&seq=related-south-korea-001&orientation=landscape",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Advanced Anti-Fraud Security System Protects Customer Shipments",
      excerpt: "DML Logistics implements cutting-edge blockchain-based security measures and AI fraud detection to prevent package theft.",
      date: "September 8, 2025",
      category: "Security & Fraud Prevention",
      image: "https://readdy.ai/api/search-image?query=Advanced%20security%20system%20for%20logistics%20with%20blockchain%20technology%2C%20digital%20security%20shields%20protecting%20packages&width=300&height=200&seq=related-fraud-prevention-001&orientation=landscape",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "DML Logistics Opens European Operations Center in Romania",
      excerpt: "New regional headquarters in Bucharest establishes DML as a major player in Eastern European logistics.",
      date: "August 28, 2025",
      category: "European Expansion",
      image: "https://readdy.ai/api/search-image?query=Professional%20logistics%20headquarters%20building%20in%20Bucharest%20Romania%20with%20DML%20Logistics%20signage&width=300&height=200&seq=related-romania-001&orientation=landscape",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="py-6 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>•</span>
              <Link to="/news" className="hover:text-blue-600 transition-colors">News</Link>
              <span>•</span>
              <span className="text-gray-900">Article</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600 mb-8">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <div className="mb-8">
              <img 
                alt={article.title}
                className="w-full aspect-video object-cover rounded-2xl shadow-lg"
                src={article.image}
              />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n/g, '').replace(/<h2>/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">').replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 my-6">').replace(/<li>/g, '<li class="text-gray-800">').replace(/<p>/g, '<p class="mb-6 text-gray-800 leading-relaxed">') 
                }}
              />
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="py-8 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="py-8 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <i className="ri-facebook-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors cursor-pointer">
                  <i className="ri-twitter-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors cursor-pointer">
                  <i className="ri-linkedin-fill"></i>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer">
                  <i className="ri-mail-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with DML News</h2>
            <p className="text-xl text-blue-100 mb-8">
              Get the latest logistics industry insights and company updates delivered to your inbox
            </p>
            <form 
              id="newsletter-form"
              data-readdy-form
              action="https://readdy.ai/api/form/submit/newsletter-subscription"
              method="POST"
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button 
                type="submit"
                className="whitespace-nowrap cursor-pointer bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-blue-200 mt-4">
              Join 50,000+ logistics professionals. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {relatedArticle.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{relatedArticle.date}</span>
                      <span>•</span>
                      <span>{relatedArticle.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {relatedArticle.excerpt}
                    </p>
                    <Link 
                      to={`/news/article/${relatedArticle.id}`}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Back to News */}
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link 
              to="/news"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line"></i>
              Back to All News
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NewsArticle;
