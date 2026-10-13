import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { analyzeProject, extractFile } from '../lib/php/analyzer.ts';
import type { TypeModel } from '../lib/php/types.ts';

function fixture(name: string) {
  return { path: `fixtures/${name}`, content: readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8') };
}

function find(types: TypeModel[], id: string): TypeModel {
  const type = types.find((candidate) => candidate.id === id);
  assert.ok(type, `expected ${id} in ${types.map((candidate) => candidate.id).join(', ')}`);
  return type;
}

test('extracts every declaration kind with namespaces and imports resolved', () => {
  const { types, status } = extractFile(fixture('modern.php'));
  assert.equal(status, 'parsed');

  const user = find(types, 'App\\Domain\\User');
  assert.equal(user.kind, 'class');
  assert.ok(user.isFinal && user.isReadonly);
  assert.deepEqual(user.extends, ['Some\\Base']);
  assert.deepEqual(user.implements, ['App\\Contracts\\Repository', 'Countable']);
  assert.deepEqual(user.traits, ['App\\Domain\\HasName', 'Other\\Trait2']);

  assert.equal(find(types, 'App\\Domain\\Repository').kind, 'interface');
  assert.deepEqual(find(types, 'App\\Domain\\Repository').extends, ['App\\Domain\\A', 'App\\Domain\\B']);
  assert.equal(find(types, 'App\\Domain\\HasName').kind, 'trait');
  assert.deepEqual(find(types, 'App\\Domain\\Status').cases, ['Active', 'Off']);
  assert.ok(find(types, 'App\\Domain\\Shape').isAbstract);
  assert.equal(find(types, 'Other\\User').namespace, 'Other');
  assert.equal(types.length, 6);
});

test('captures typed members, promoted properties and modern type syntax', () => {
  const user = find(extractFile(fixture('modern.php')).types, 'App\\Domain\\User');

  const id = user.properties.find((property) => property.name === 'id');
  assert.deepEqual(id && { visibility: id.visibility, type: id.type, isReadonly: id.isReadonly }, {
    visibility: 'private',
    type: 'int|string',
    isReadonly: true,
  });

  const address = user.properties.find((property) => property.name === 'addr');
  assert.equal(address?.type, '?Address');
  assert.deepEqual(address?.references, ['App\\Domain\\Address']);

  const cache = user.properties.find((property) => property.name === 'cache');
  assert.ok(cache?.isStatic);
  assert.equal(cache?.type, '?array');

  const make = user.methods.find((method) => method.name === 'make');
  assert.equal(make?.parameters[0].type, 'Foo&Bar');
  assert.equal(make?.returnType, 'self');
  assert.equal(user.methods.find((method) => method.name === 'find')?.returnType, 'static|null');
  assert.deepEqual(user.constants.map((constant) => constant.name), ['MAX']);
});

test('falls back to token scanning when the parser cannot handle newer syntax', () => {
  const { types, status, issues } = extractFile(fixture('property-hooks.php'));
  assert.equal(status, 'recovered');
  assert.equal(issues.length, 1);

  const invoice = find(types, 'App\\Billing\\Invoice');
  assert.ok(invoice.isPartial && invoice.isFinal);
  assert.deepEqual(invoice.extends, ['App\\Billing\\Document']);
  assert.deepEqual(invoice.implements, ['App\\Contracts\\Payable']);
  assert.deepEqual(invoice.traits, ['App\\Billing\\HasTotals']);
  assert.deepEqual(invoice.constants.map((constant) => constant.name), ['PREFIX']);
  assert.deepEqual(
    invoice.properties.map((property) => [property.name, property.visibility, property.type]),
    [
      ['number', 'public', 'string'],
      ['customer', 'private', '?Customer'],
      ['id', 'private', 'int'],
    ],
  );
  assert.deepEqual(
    invoice.methods.map((method) => [method.name, method.isStatic, method.returnType]),
    [
      ['__construct', false, undefined],
      ['draft', true, 'static'],
      ['items', false, 'array'],
    ],
  );
  assert.deepEqual(invoice.methods[1].parameters, [
    { name: 'customer', type: 'Customer', isVariadic: false, isByRef: false },
    { name: 'lines', type: 'string', isVariadic: true, isByRef: false },
  ]);
  assert.deepEqual(invoice.properties[1].references, ['App\\Billing\\Customer']);
  assert.deepEqual(find(types, 'App\\Billing\\InvoiceState').cases, ['Draft', 'Paid']);
});

test('reads legacy files that use short open tags', () => {
  const { types } = extractFile(fixture('legacy.php'));
  const report = find(types, 'Legacy_Report');
  assert.deepEqual(report.extends, ['Base_Report']);
  assert.deepEqual(report.properties.map((property) => property.name), ['rows']);
  assert.deepEqual(report.methods.map((method) => method.name), ['render']);
});

test('recovers declarations around syntax errors and reports them', () => {
  const { types, status, issues } = extractFile({
    path: 'broken.php',
    content: '<?php class A { public function x() { $a = ; } } class B extends A {}',
  });
  assert.equal(status, 'recovered');
  assert.ok(issues.length > 0);
  assert.deepEqual(types.map((type) => type.id), ['A', 'B']);
});

test('reports duplicate declarations and keeps the first one', () => {
  const project = analyzeProject([
    { path: 'a.php', content: '<?php namespace App; class Dup {}' },
    { path: 'b.php', content: '<?php namespace App; class Dup { public $x; }' },
    { path: 'c.php', content: '<?php class Global_ {}' },
  ]);
  assert.equal(project.types.length, 2);
  assert.equal(find(project.types, 'App\\Dup').file, 'a.php');
  assert.match(project.issues[0].message, /Duplicate declaration of App\\Dup/);
  assert.deepEqual(project.namespaces, ['', 'App']);
});
