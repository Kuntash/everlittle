import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  Heart,
  LockKeyhole,
  Mic2,
  Play,
  ShieldCheck,
  UsersRound,
  Video,
} from "lucide-react";
import { useEffect } from "react";

import { Brand } from "@/components/brand";

const waveform = [12, 25, 18, 33, 21, 39, 27, 15, 34, 43, 22, 29, 41, 17, 27, 36, 21, 14];

function Waveform() {
  return (
    <div className="scrapbook-wave" aria-label="Voice memory, one minute and thirty-four seconds">
      <span className="scrapbook-wave-play" aria-hidden="true">
        <Play size={13} fill="currentColor" />
      </span>
      <span aria-hidden="true">
        {waveform.map((height, index) => (
          <i key={`${height}-${index}`} style={{ height }} />
        ))}
      </span>
      <small>1:34</small>
    </div>
  );
}

export function ScrapbookHome() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".scrapbook-home");
    if (!root) return;

    const targets = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("is-reveal-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-revealed"));
      return () => root.classList.remove("is-reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      root.classList.remove("is-reveal-ready");
    };
  }, []);

  return (
    <main className="scrapbook-home">
      <header className="scrapbook-hero">
        <nav className="scrapbook-nav" aria-label="Main navigation">
          <a href="/" aria-label="Everlittle home">
            <Brand compact />
          </a>
          <div>
            <a href="#keeps">Family story</a>
            <a href="#privacy">Privacy</a>
            <a href="#pricing">Pricing</a>
            <a href="/sign-in">Sign in</a>
            <a className="scrapbook-nav-cta" href="/sign-up">
              Start our archive
            </a>
          </div>
        </nav>

        <div className="scrapbook-hero-layout">
          <div className="scrapbook-hero-copy">
            <p className="scrapbook-kicker">
              <Heart fill="currentColor" /> A private place for your family
            </p>
            <h1>
              <span>Keep the little</span>
              <span>things they’ll ask</span>
              <span>about one day.</span>
            </h1>
            <p className="scrapbook-hero-lede">
              Photos, voices, stories, videos, and letters from the people who love them—all
              together in one private family place.
            </p>
            <div className="scrapbook-hero-actions">
              <a className="scrapbook-button scrapbook-button-primary" href="/sign-up">
                Start our family archive <ArrowRight />
              </a>
              <a className="scrapbook-button scrapbook-button-quiet" href="#keeps">
                Take a little tour
              </a>
            </div>
            <small>Begin free · No card required · Invite the whole family</small>
          </div>

          <div className="scrapbook-hero-collage" aria-label="A family archive made of memories">
            <span className="scrapbook-sun" aria-hidden="true" />
            <figure className="scrapbook-polaroid scrapbook-hero-photo-card">
              <span className="scrapbook-tape" aria-hidden="true" />
              <img
                src="/marketing/family-album.jpg"
                alt="Three generations looking through a family album"
                width="1536"
                height="1024"
                fetchPriority="high"
              />
              <figcaption>
                <b>A rainy afternoon together</b>
                <span>May 14, 2016 · Mum</span>
              </figcaption>
            </figure>

            <article className="scrapbook-hero-voice">
              <div>
                <span className="scrapbook-avatar">G</span>
                <p>
                  <b>Grandpa’s story</b>
                  <small>about the old house</small>
                </p>
              </div>
              <Waveform />
            </article>

            <article className="scrapbook-hero-note">
              <span>AGE 4½</span>
              <p>“When I grow up I’m going to be a moon doctor.”</p>
              <small>— Lhamo</small>
            </article>

            <article className="scrapbook-hero-letter">
              <img
                src="/marketing/objects/sealed-envelope.png"
                alt="A sealed letter for the future"
                width="1254"
                height="1254"
              />
              <span>
                OPEN WHEN
                <strong>you turn 18</strong>
              </span>
            </article>
            <span className="scrapbook-pencil-note">all the bits that make us, us ↗</span>
          </div>
        </div>
      </header>

      <section className="scrapbook-story" id="keeps">
        <header className="scrapbook-section-heading" data-reveal>
          <p className="scrapbook-kicker">A family story, told a little at a time</p>
          <h2>The ordinary days become the good old days.</h2>
          <p>
            Everlittle keeps the moment and the story around it—so a photograph never has to stand
            alone.
          </p>
        </header>

        <div className="scrapbook-timeline">
          <span className="scrapbook-timeline-line" aria-hidden="true" />
          <article className="scrapbook-moment scrapbook-moment-photo" data-reveal>
            <div className="scrapbook-date-bubble">2016</div>
            <figure className="scrapbook-polaroid">
              <img
                src="/marketing/family-album.jpg"
                alt="A family photograph kept with its story"
                width="1536"
                height="1024"
                loading="lazy"
              />
              <figcaption>
                <b>The Sunday nobody got dressed</b>
                <span>We made pancakes for dinner.</span>
              </figcaption>
            </figure>
          </article>

          <article className="scrapbook-moment scrapbook-moment-voice" data-reveal>
            <div className="scrapbook-date-bubble">2018</div>
            <div className="scrapbook-audio-card">
              <Mic2 />
              <p>
                <small>VOICE MEMORY · 01:34</small>
                <b>The way you said “spaghetti” at three</b>
              </p>
              <Waveform />
              <span>Recorded by Dad</span>
            </div>
          </article>

          <article className="scrapbook-moment scrapbook-moment-video" data-reveal>
            <div className="scrapbook-date-bubble">2021</div>
            <div className="scrapbook-video-card">
              <img
                src="/marketing/voice-memory.jpg"
                alt="A short family video memory"
                width="1536"
                height="1152"
                loading="lazy"
              />
              <span className="scrapbook-video-play" aria-hidden="true">
                <Play fill="currentColor" />
              </span>
              <p>
                <b>Your first very wobbly bicycle ride</b>
                <span>0:23 · Added by Auntie Tenzin</span>
              </p>
            </div>
          </article>

          <article className="scrapbook-moment scrapbook-moment-letter" data-reveal>
            <div className="scrapbook-date-bubble">2032</div>
            <div className="scrapbook-future-card">
              <LockKeyhole />
              <p>
                <small>WAITING FOR YOU</small>
                <b>A letter from Mum for your eighteenth birthday</b>
              </p>
              <span>Opens May 14, 2032</span>
            </div>
          </article>
        </div>
      </section>

      <section className="scrapbook-together">
        <div className="scrapbook-together-copy" data-reveal>
          <p className="scrapbook-kicker">Made by all of you</p>
          <h2>Everyone remembers a different part.</h2>
          <p>
            Mum has the photographs. Grandpa knows the stories. Your sister remembers what happened
            next. Bring all of it together.
          </p>
          <a href="/sign-up">
            Invite your people <ArrowRight />
          </a>
        </div>

        <div className="scrapbook-contributions" data-reveal>
          <article className="scrapbook-contribution contribution-mum">
            <span className="scrapbook-avatar">M</span>
            <p>
              <b>Mum</b> added 6 photographs<small>2 minutes ago</small>
            </p>
            <Camera />
          </article>
          <article className="scrapbook-contribution contribution-grandpa">
            <span className="scrapbook-avatar">G</span>
            <p>
              <b>Grandpa</b> recorded a story<small>Yesterday</small>
            </p>
            <Mic2 />
          </article>
          <article className="scrapbook-contribution contribution-auntie">
            <span className="scrapbook-avatar">A</span>
            <p>
              <b>Auntie</b> left a memory<small>Sunday</small>
            </p>
            <Heart />
          </article>
          <div className="scrapbook-family-center">
            <UsersRound />
            <strong>Our family</strong>
            <span>8 people keeping the story</span>
          </div>
        </div>
      </section>

      <section className="scrapbook-formats">
        <header className="scrapbook-section-heading" data-reveal>
          <p className="scrapbook-kicker">More than a camera roll</p>
          <h2>Some memories need more than a photograph.</h2>
        </header>
        <div className="scrapbook-format-grid">
          <article className="scrapbook-format format-photo" data-reveal>
            <Camera />
            <small>PHOTOGRAPHS</small>
            <h3>Keep the story behind the picture.</h3>
          </article>
          <article className="scrapbook-format format-voice" data-reveal>
            <Mic2 />
            <small>VOICES</small>
            <h3>Save their laugh, not just the photo afterward.</h3>
            <Waveform />
          </article>
          <article className="scrapbook-format format-video" data-reveal>
            <Video />
            <small>VIDEOS</small>
            <h3>The wobble, the wave, the way they ran back to you.</h3>
          </article>
          <article className="scrapbook-format format-story" data-reveal>
            <BookOpen />
            <small>STORIES</small>
            <h3>Write it down before everyone remembers it differently.</h3>
          </article>
        </div>
      </section>

      <section className="scrapbook-capsule">
        <div className="scrapbook-capsule-object" data-reveal>
          <span className="scrapbook-capsule-orbit" aria-hidden="true" />
          <img
            src="/marketing/objects/sealed-envelope.png"
            alt="A sealed family letter waiting for the future"
            width="1254"
            height="1254"
            loading="lazy"
          />
          <span className="scrapbook-capsule-label">
            FOR LHAMO<small>Open on your 18th birthday</small>
          </span>
        </div>
        <div className="scrapbook-capsule-copy" data-reveal>
          <p className="scrapbook-kicker">Future capsules</p>
          <h2>Some things are meant for later.</h2>
          <p>
            Write a letter, add a recording, or gather a few memories. Choose the day it should be
            opened.
          </p>
          <ul>
            <li>For your first day away from home</li>
            <li>For the day you become a parent</li>
            <li>For whenever you need to hear my voice</li>
          </ul>
        </div>
      </section>

      <section className="scrapbook-privacy" id="privacy">
        <div className="scrapbook-privacy-copy" data-reveal>
          <p className="scrapbook-kicker">
            <ShieldCheck /> Private by default
          </p>
          <h2>Family memories should stay in the family.</h2>
          <p>
            No public profiles. No advertising. No strangers watching. You decide who is invited and
            what each person can see.
          </p>
          <div className="scrapbook-promises">
            <span>
              <Check /> Invite only people you trust
            </span>
            <span>
              <Check /> Give children a protected view
            </span>
            <span>
              <Check /> Export the memories you add
            </span>
          </div>
          <strong>Your child is not the product.</strong>
        </div>
        <div className="scrapbook-family-circle" data-reveal aria-label="A private family circle">
          <span className="family-person person-one">Mum</span>
          <span className="family-person person-two">Dad</span>
          <span className="family-person person-three">Grandpa</span>
          <span className="family-person person-four">Auntie</span>
          <div>
            <LockKeyhole />
            <b>Our family</b>
            <small>Private and invited</small>
          </div>
        </div>
      </section>

      <section className="scrapbook-price" id="pricing">
        <div className="scrapbook-price-copy" data-reveal>
          <p className="scrapbook-kicker">One archive for the whole family</p>
          <h2>A small home for a lifetime of little things.</h2>
          <p>No advertising, no audience-building, and no charge for inviting your family.</p>
        </div>
        <article className="scrapbook-price-card" data-reveal>
          <span className="scrapbook-price-sticker">FAMILY PLAN</span>
          <div className="scrapbook-price-number">
            <small>$</small>
            <strong>6</strong>
            <span>
              USD
              <br />a month
            </span>
          </div>
          <p>or $60 a year · two months on us</p>
          <ul>
            <li>
              <Check /> 25 GB for photos, voices, stories, and video
            </li>
            <li>
              <Check /> Unlimited invited family members
            </li>
            <li>
              <Check /> Child spaces and future capsules
            </li>
            <li>
              <Check /> Private sharing and data export
            </li>
          </ul>
          <a href="/sign-up">
            Start our family archive <ArrowRight />
          </a>
          <small>Founding access is free while billing opens. No card required today.</small>
        </article>
      </section>

      <section className="scrapbook-closing">
        <div className="scrapbook-closing-photo" data-reveal>
          <img
            src="/marketing/family-album.jpg"
            alt="A family sharing memories together"
            width="1536"
            height="1024"
            loading="lazy"
          />
          <span>Keep this one ♡</span>
        </div>
        <div className="scrapbook-closing-copy" data-reveal>
          <Heart fill="currentColor" />
          <h2>One day, these won’t feel like little things.</h2>
          <p>Begin with one photograph, one story, or one voice you never want them to forget.</p>
          <a href="/sign-up">
            Keep our first memory <ArrowRight />
          </a>
        </div>
      </section>

      <footer className="scrapbook-footer">
        <Brand compact />
        <p>Made for the people who know the whole story.</p>
        <nav aria-label="Footer navigation">
          <a href="/sign-in">Sign in</a>
          <a href="/pricing">Pricing</a>
          <a href="#privacy">Privacy</a>
          <a href="https://github.com/Kuntash/everlittle">Open source</a>
        </nav>
      </footer>
    </main>
  );
}
