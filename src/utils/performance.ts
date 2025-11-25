// Performance optimization utilities
import React from 'react';

// Lazy loading for components
export const lazyLoadComponent = (importFunc: () => Promise<{ default: React.ComponentType<unknown> }>) => {
  return React.lazy(importFunc);
};

// Image optimization
export const optimizeImage = (src: string, width?: number, quality: number = 80) => {
  if (!src) return '';
  
  // If it's already an optimized URL, return as is
  if (src.includes('?')) return src;
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  return `${src}?${params.toString()}`;
};

// Debounce function for search inputs
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization for expensive calculations
export const memoize = <T extends (...args: unknown[]) => unknown>(
  func: T
): T => {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Preload critical resources
export const preloadResource = (href: string, as: string = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });
  }
  return null;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if ('performance' in window) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    fn();
  }
};

// Bundle size optimization
export const loadComponentOnDemand = (componentName: string) => {
  return import(/* @vite-ignore */ `../components/${componentName}`).catch(() => {
    console.warn(`Failed to load component: ${componentName}`);
    return { default: () => null };
  });
};

// Memory cleanup
export const cleanup = (cleanupFn: () => void) => {
  return () => {
    cleanupFn();
  };
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

// Resource hints
export const addResourceHints = () => {
  // Only add hints that don't already exist
  const existingHints = Array.from(document.querySelectorAll('link[rel="dns-prefetch"], link[rel="preconnect"]'))
    .map(link => (link as HTMLLinkElement).href);
  
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://api.github.com' }
  ];
  
  hints.forEach(hint => {
    // Skip if already exists
    if (existingHints.some(existing => existing.includes(new URL(hint.href, window.location.origin).hostname))) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossorigin) {
      link.setAttribute('crossorigin', 'anonymous');
    }
    document.head.appendChild(link);
  });
};

export default {
  lazyLoadComponent,
  optimizeImage,
  debounce,
  throttle,
  memoize,
  preloadResource,
  createIntersectionObserver,
  measurePerformance,
  loadComponentOnDemand,
  cleanup,
  inlineCriticalCSS,
  registerServiceWorker,
  addResourceHints
};
