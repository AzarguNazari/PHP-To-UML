import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import nomnoml from 'nomnoml';
import { buildDiagram, DEFAULT_DIAGRAM_OPTIONS } from '../lib/diagram/nomnoml.ts';
import { analyzeProject } from '../lib/php/analyzer.ts';

const project = analyzeProject(
  ['modern.php', 'property-hooks.php', 'legacy.php'].map((name) => ({
    path: name,
    content: readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8'),
  })),
);

test('produces a diagram nomnoml can render for every fixture', () => {
  const diagram = buildDiagram(project.types, DEFAULT_DIAGRAM_OPTIONS);
  const svg = nomnoml.renderSvg(diagram.source);
  assert.match(svg, /^<svg/);
  assert.ok(svg.includes('int|string'), 'union types must survive escaping');
  assert.ok(diagram.edgeCount > 0);
});

test('keeps same-named classes from different namespaces apart', () => {
  const diagram = buildDiagram(project.types, DEFAULT_DIAGRAM_OPTIONS);
  assert.ok(diagram.source.includes('id=App\\Domain\\User>App\\\\Domain\\\\User'));
  assert.ok(diagram.source.includes('id=Other\\User>Other\\\\User'));
});

test('filters by namespace and focus', () => {
  const billing = buildDiagram(project.types, { ...DEFAULT_DIAGRAM_OPTIONS, namespace: 'App\\Billing' });
  assert.ok(billing.source.includes('Invoice'));
  assert.ok(!billing.source.includes('id=App\\Domain\\Status'));

  const focus = buildDiagram(project.types, { ...DEFAULT_DIAGRAM_OPTIONS, focus: 'App\\Domain\\HasName' });
  assert.ok(focus.source.includes('id=App\\Domain\\User'));
  assert.ok(!focus.source.includes('id=App\\Domain\\Shape'));
});

test('names-only detail omits members', () => {
  const diagram = buildDiagram(project.types, { ...DEFAULT_DIAGRAM_OPTIONS, detail: 'names' });
  assert.ok(!diagram.source.includes('__construct'));
  nomnoml.renderSvg(diagram.source);
});
