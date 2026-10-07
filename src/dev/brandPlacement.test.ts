import * as fs from 'fs';
import * as path from 'path';

/**
 * Brand placement rule. The Davy Designs credit (<DesignedBy />) may appear only where a
 * designer's credit belongs: the home footer and the component gallery that documents it.
 * It must never appear on a product screen (accounts, assistant, insights, fraud, AI settings),
 * inside a fintech or AI component, or in the header: those carry the PRODUCT's identity, and a
 * designer's mark there would read as the product's own branding.
 */
const ALLOWED = new Set(['src/app/index.tsx', 'src/app/gallery.tsx']);
const IGNORED = /(\.test\.|DesignedBy\.tsx$|designerLogoPath\.ts$|components\/core\/index\.ts$)/;

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe('brand placement', () => {
  const root = path.join(__dirname, '../..');
  const files = sourceFiles(path.join(root, 'src')).map((file) => path.relative(root, file));

  it('uses DesignedBy only in the home footer and the gallery', () => {
    const offenders = files
      .filter((file) => !IGNORED.test(file) && !ALLOWED.has(file))
      .filter((file) => /<DesignedBy\b|DESIGNER_LOGO_PATH/.test(fs.readFileSync(path.join(root, file), 'utf8')));
    expect(offenders).toEqual([]);
  });

  it('keeps the credit out of the header (the layout renders the product logo only)', () => {
    const layout = fs.readFileSync(path.join(root, 'src/app/_layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/DesignedBy|DESIGNER_/);
    expect(layout).toMatch(/<Logo\b/);
  });

  it('actually uses the credit in the home footer', () => {
    expect(fs.readFileSync(path.join(root, 'src/app/index.tsx'), 'utf8')).toMatch(/<DesignedBy\b/);
  });
});
