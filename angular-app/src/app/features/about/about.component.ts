import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h1>📚 Educational Worksheets Platform</h1>
          <p class="hero-subtitle">
            High-quality, curriculum-aligned learning materials for grades 1-12
          </p>
          <div class="hero-stats">
            <div class="stat">
              <h3>500+</h3>
              <p>Worksheets</p>
            </div>
            <div class="stat">
              <h3>12</h3>
              <p>Grade Levels</p>
            </div>
            <div class="stat">
              <h3>10K+</h3>
              <p>Students Helped</p>
            </div>
            <div class="stat">
              <h3>100%</h3>
              <p>Free Access</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mission Section -->
      <div class="mission-section">
        <div class="container">
          <h2>🎯 Our Mission</h2>
          <div class="mission-content">
            <div class="mission-text">
              <p>
                We believe that every student deserves access to high-quality educational materials. 
                Our platform provides comprehensive, curriculum-aligned worksheets that support 
                learning across all grade levels and subjects.
              </p>
              <p>
                Built with modern technology and educational best practices, we're transforming 
                how educators create, distribute, and track student progress with dynamic, 
                interactive learning materials.
              </p>
            </div>
            <div class="mission-visual">
              <div class="mission-icon">🚀</div>
              <h3>Empowering Education</h3>
              <p>Through Technology</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="features-section">
        <div class="container">
          <h2>✨ Key Features</h2>
          <div class="features-grid">
            <div *ngFor="let feature of features" class="feature-card">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="team-section">
        <div class="container">
          <h2>👥 Meet Our Team</h2>
          <div class="team-grid">
            <div *ngFor="let member of teamMembers" class="team-card">
              <div class="member-avatar">
                <div class="avatar-placeholder">{{ getInitials(member.name) }}</div>
              </div>
              <h3>{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-bio">{{ member.bio }}</p>
              <div class="social-links" *ngIf="member.social">
                <a *ngIf="member.social.linkedin" [href]="member.social.linkedin" target="_blank" class="social-link">
                  💼 LinkedIn
                </a>
                <a *ngIf="member.social.github" [href]="member.social.github" target="_blank" class="social-link">
                  🐙 GitHub
                </a>
                <a *ngIf="member.social.twitter" [href]="member.social.twitter" target="_blank" class="social-link">
                  🐦 Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technology Section -->
      <div class="technology-section">
        <div class="container">
          <h2>⚡ Technology Stack</h2>
          <div class="tech-content">
            <div class="tech-description">
              <p>
                Built with cutting-edge web technologies to ensure fast, reliable, 
                and scalable educational content delivery.
              </p>
            </div>
            <div class="tech-stack">
              <div class="tech-category">
                <h4>Frontend</h4>
                <div class="tech-tags">
                  <span class="tech-tag">Angular 17</span>
                  <span class="tech-tag">TypeScript</span>
                  <span class="tech-tag">RxJS</span>
                  <span class="tech-tag">CSS3</span>
                </div>
              </div>
              <div class="tech-category">
                <h4>Content Processing</h4>
                <div class="tech-tags">
                  <span class="tech-tag">Markdown</span>
                  <span class="tech-tag">Marked.js</span>
                  <span class="tech-tag">Pandoc</span>
                  <span class="tech-tag">jsPDF</span>
                </div>
              </div>
              <div class="tech-category">
                <h4>Infrastructure</h4>
                <div class="tech-tags">
                  <span class="tech-tag">GitHub Pages</span>
                  <span class="tech-tag">PWA</span>
                  <span class="tech-tag">Service Workers</span>
                  <span class="tech-tag">Local Storage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Open Source Section -->
      <div class="open-source-section">
        <div class="container">
          <h2>🌟 Open Source & Community</h2>
          <div class="open-source-content">
            <div class="open-source-text">
              <p>
                This project is proudly open source! We believe in collaborative 
                development and welcome contributions from educators, developers, 
                and anyone passionate about improving education.
              </p>
              <div class="contribution-ways">
                <h4>Ways to Contribute:</h4>
                <ul>
                  <li>🐛 Report bugs and suggest improvements</li>
                  <li>📝 Create new worksheet content</li>
                  <li>💻 Contribute code and features</li>
                  <li>📖 Improve documentation</li>
                  <li>🌍 Translate content for global accessibility</li>
                </ul>
              </div>
            </div>
            <div class="github-links">
              <a href="https://github.com/shakoorhussain/educational-worksheets" target="_blank" class="github-link">
                <div class="github-icon">🐙</div>
                <div>
                  <h4>View on GitHub</h4>
                  <p>Source code and documentation</p>
                </div>
              </a>
              <a href="https://github.com/shakoorhussain/educational-worksheets/issues" target="_blank" class="github-link">
                <div class="github-icon">🐛</div>
                <div>
                  <h4>Report Issues</h4>
                  <p>Bug reports and feature requests</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="contact-section">
        <div class="container">
          <h2>📧 Get in Touch</h2>
          <div class="contact-content">
            <div class="contact-info">
              <p>
                Have questions, suggestions, or want to collaborate? 
                We'd love to hear from you!
              </p>
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="contact-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>contact&#64;educationalworksheets.com</p>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">💬</div>
                  <div>
                    <h4>Discussions</h4>
                    <p>GitHub Discussions for community support</p>
                  </div>
                </div>
                <div class="contact-method">
                  <div class="contact-icon">📱</div>
                  <div>
                    <h4>Social Media</h4>
                    <p>Follow us for updates and educational content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright Section -->
      <div class="copyright-section">
        <div class="container">
          <div class="copyright-content">
            <p>
              © 2024-2025 Shakoor Hussain Attari | Educational Materials
            </p>
            <p>
              All worksheets and educational content are provided under the 
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">
                Creative Commons Attribution-ShareAlike 4.0 License
              </a>
            </p>
            <div class="footer-links">
              <a routerLink="/dashboard">🏠 Dashboard</a>
              <a routerLink="/browse">📚 Browse Worksheets</a>
              <a routerLink="/settings">⚙️ Settings</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      background: #f8f9fa;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero-section h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.3rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .stat {
      text-align: center;
    }

    .stat h3 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .stat p {
      opacity: 0.9;
      font-size: 1.1rem;
    }

    /* Mission Section */
    .mission-section {
      padding: 4rem 0;
      background: white;
    }

    .mission-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .mission-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .mission-text p {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #555;
      margin-bottom: 1.5rem;
    }

    .mission-visual {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 16px;
    }

    .mission-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .mission-visual h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    /* Features Section */
    .features-section {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .features-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    /* Team Section */
    .team-section {
      padding: 4rem 0;
      background: white;
    }

    .team-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .team-card {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .team-card:hover {
      transform: translateY(-4px);
    }

    .member-avatar {
      margin-bottom: 1rem;
    }

    .avatar-placeholder {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .team-card h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .member-role {
      color: #667eea;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .member-bio {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .social-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .social-link:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    /* Technology Section */
    .technology-section {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .technology-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .tech-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .tech-description {
      text-align: center;
      margin-bottom: 3rem;
    }

    .tech-description p {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.8;
    }

    .tech-stack {
      display: grid;
      gap: 2rem;
    }

    .tech-category h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-tag {
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Open Source Section */
    .open-source-section {
      padding: 4rem 0;
      background: white;
    }

    .open-source-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .open-source-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: start;
    }

    .open-source-text p {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.8;
      margin-bottom: 2rem;
    }

    .contribution-ways h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .contribution-ways ul {
      list-style: none;
      padding: 0;
    }

    .contribution-ways li {
      color: #666;
      margin-bottom: 0.5rem;
      padding-left: 1rem;
    }

    .github-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .github-link {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: background 0.2s ease;
    }

    .github-link:hover {
      background: #e9ecef;
    }

    .github-icon {
      font-size: 2rem;
    }

    .github-link h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .github-link p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    /* Contact Section */
    .contact-section {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .contact-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 3rem;
    }

    .contact-content {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }

    .contact-info p {
      font-size: 1.1rem;
      color: #666;
      line-height: 1.8;
      margin-bottom: 2rem;
    }

    .contact-methods {
      display: grid;
      gap: 1.5rem;
    }

    .contact-method {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
    }

    .contact-icon {
      font-size: 2rem;
    }

    .contact-method h4 {
      margin: 0 0 0.25rem 0;
      color: #2c3e50;
    }

    .contact-method p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    /* Copyright Section */
    .copyright-section {
      background: #2c3e50;
      color: white;
      padding: 2rem 0;
    }

    .copyright-content {
      text-align: center;
    }

    .copyright-content p {
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .copyright-content a {
      color: #3498db;
      text-decoration: none;
    }

    .copyright-content a:hover {
      text-decoration: underline;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .footer-links a {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-links a:hover {
      text-decoration: underline;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .container {
        padding: 0 1rem;
      }

      .hero-section h1 {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .hero-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .mission-content,
      .open-source-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .features-grid,
      .team-grid {
        grid-template-columns: 1fr;
      }

      .footer-links {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class AboutComponent {
  features: Feature[] = [
    {
      icon: '📚',
      title: 'Comprehensive Content',
      description: 'High-quality worksheets covering all major subjects from grades 1-12, aligned with curriculum standards.'
    },
    {
      icon: '🎯',
      title: 'Curriculum Aligned',
      description: 'All materials are carefully crafted to meet educational standards and learning objectives.'
    },
    {
      icon: '⚡',
      title: 'Dynamic Generation',
      description: 'Convert markdown content to HTML and PDF formats on-demand with professional styling.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access worksheets from any device with our fully responsive design and PWA capabilities.'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find exactly what you need with advanced filtering by grade, subject, difficulty, and topic.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor learning progress with detailed analytics and personalized insights.'
    },
    {
      icon: '💾',
      title: 'Offline Access',
      description: 'Download worksheets for offline use and access your favorites without internet.'
    },
    {
      icon: '🌍',
      title: 'Open Source',
      description: 'Contribute to the platform and help improve education for students worldwide.'
    }
  ];

  teamMembers: TeamMember[] = [
    {
      name: 'Shakoor Hussain Attari',
      role: 'Founder & Lead Developer',
      bio: 'Passionate educator and developer focused on making quality education accessible to all.',
      avatar: 'SHA',
      social: {
        github: 'https://github.com/shakoorhussain',
        linkedin: 'https://linkedin.com/in/shakoorhussain'
      }
    },
    {
      name: 'Educational Advisory Board',
      role: 'Curriculum Specialists',
      bio: 'Experienced educators ensuring all content meets the highest educational standards.',
      avatar: 'EAB'
    },
    {
      name: 'Open Source Contributors',
      role: 'Community Developers',
      bio: 'Talented developers from around the world contributing to the platform\'s growth.',
      avatar: 'OSC',
      social: {
        github: 'https://github.com/shakoorhussain/educational-worksheets/contributors'
      }
    }
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 3);
  }
}
