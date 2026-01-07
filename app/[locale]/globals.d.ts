// style.d.ts
// TypeScript declarations for CSS/SCSS modules and global imports

// Regular global CSS (like globals.css)
declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// CSS Modules (typed object mapping class names)
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

// Optional: allow importing Tailwind config as JSON if needed
declare module "*.config.js";
