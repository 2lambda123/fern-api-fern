import { RelativeFilePath } from "@fern-api/fs-utils";
import { FernGeneratorExec } from "@fern-fern/generator-exec-sdk";
import { DeclaredTypeName, IntermediateRepresentation } from "@fern-fern/ir-sdk/api";
import { camelCase, upperFirst } from "lodash-es";
import { Expression } from "../ast/expressions/Expression";
import { ExternalDependency } from "../ast/ExternalDependency";
import { Gemspec } from "../ast/gem/Gemspec";
import { Module_ } from "../ast/Module_";
import { GeneratedFile } from "./GeneratedFile";
import { GeneratedRubyFile } from "./GeneratedRubyFile";
import { SERVICES_DIRECTORY, TYPES_DIRECTORY } from "./RubyConstants";

export function getGemName(
    intermediateRepresentation: IntermediateRepresentation,
    config: FernGeneratorExec.GeneratorConfig,
    clientClassName?: string,
    gemName?: string
): string {
    return gemName ?? getClientName(intermediateRepresentation, config, clientClassName);
}

export function getClientName(
    intermediateRepresentation: IntermediateRepresentation,
    config: FernGeneratorExec.GeneratorConfig,
    clientClassName?: string
): string {
    return (
        clientClassName ??
        upperFirst(camelCase(config.organization)) +
            upperFirst(camelCase(intermediateRepresentation.apiName.camelCase.safeName)) +
            "Client"
    );
}

export function getLocationForTypeDeclaration(declaredTypeName: DeclaredTypeName): string {
    return [
        ...declaredTypeName.fernFilepath.allParts.map((pathPart) => pathPart.snakeCase.safeName),
        TYPES_DIRECTORY,
        declaredTypeName.name.snakeCase.safeName
    ].join("/");
}

export function getLocationForServiceDeclaration(declaredTypeName: DeclaredTypeName): string {
    return [
        ...declaredTypeName.fernFilepath.allParts.map((pathPart) => pathPart.snakeCase.safeName),
        SERVICES_DIRECTORY,
        declaredTypeName.name.snakeCase.safeName
    ].join("/");
}

export function getLocationForPackageDeclaration(declaredTypeName: DeclaredTypeName): string {
    return [
        ...declaredTypeName.fernFilepath.allParts.map((pathPart) => pathPart.snakeCase.safeName),
        declaredTypeName.name.snakeCase.safeName
    ].join("/");
}

export function generateGemspec(
    clientName: string,
    gemName: string,
    extraDependencies: ExternalDependency[]
): GeneratedRubyFile {
    const gemspec = new Gemspec({ clientName, gemName, dependencies: extraDependencies });
    return new GeneratedRubyFile({
        rootNode: gemspec,
        directoryPrefix: RelativeFilePath.of("."),
        name: `${gemName}.gemspec`,
        isConfigurationFile: true
    });
}

// To ensure configuration may be managed independently from dependenies, we introduce a new config file that
// users are encouraged to fernignore and update, while allowing the traditional gemspec to remain generated
export function generateGemConfig(clientName: string): GeneratedRubyFile {
    const gemspec = new Module_({
        name: clientName,
        child: new Module_({
            name: "Gemconfig",
            child: [
                new Expression({ leftSide: "VERSION", rightSide: '""', isAssignment: true }),
                new Expression({ leftSide: "AUTHORS", rightSide: '[""].freeze', isAssignment: true }),
                new Expression({ leftSide: "EMAIL", rightSide: '""', isAssignment: true }),
                new Expression({ leftSide: "SUMMARY", rightSide: '""', isAssignment: true }),
                new Expression({ leftSide: "DESCRIPTION", rightSide: '""', isAssignment: true }),
                // Input some placeholders for installation to work
                new Expression({
                    leftSide: "HOMEPAGE",
                    rightSide: '"https://github.com/REPO/URL"',
                    isAssignment: true
                }),
                new Expression({
                    leftSide: "SOURCE_CODE_URI",
                    rightSide: '"https://github.com/REPO/URL"',
                    isAssignment: true
                }),
                new Expression({
                    leftSide: "CHANGELOG_URI",
                    rightSide: '"https://github.com/REPO/URL/blob/master/CHANGELOG.md"',
                    isAssignment: true
                })
            ]
        })
    });
    return new GeneratedRubyFile({
        rootNode: gemspec,
        directoryPrefix: RelativeFilePath.of("."),
        name: "gemconfig.rb"
    });
}

export function generateGitignore(): GeneratedFile {
    const content = `/.bundle/
/.yardoc
/_yardoc/
/coverage/
/doc/
/pkg/
/spec/reports/
/tmp/
*.gem
.env
`;
    return new GeneratedFile(".gitignore", RelativeFilePath.of("."), content);
}

export function generateRubocopConfig(): GeneratedFile {
    const content = `AllCops:
  TargetRubyVersion: 2.6
  
Style/StringLiterals:
  Enabled: true
  EnforcedStyle: double_quotes
  
Style/StringLiteralsInInterpolation:
  Enabled: true
  EnforcedStyle: double_quotes

Layout/FirstHashElementLineBreak:
  Enabled: true

Layout/MultilineHashKeyLineBreaks:
  Enabled: true

# Generated files may be more complex than standard, disable
# these rules for now as a known limitation.
Metrics/ParameterLists:
  Enabled: false

Metrics/MethodLength:
  Enabled: false

Metrics/AbcSize:
  Enabled: false

Metrics/ClassLength:
  Enabled: false

Metrics/CyclomaticComplexity:
  Enabled: false

Metrics/PerceivedComplexity:
  Enabled: false
`;
    return new GeneratedFile(".rubocop.yml", RelativeFilePath.of("."), content);
}

// TODO: this should probably be codified in a more intentional way
export function generateGemfile(): GeneratedFile {
    const gemfileContent = `# frozen_string_literal: true

source "https://rubygems.org"

gemspec

gem "minitest", "~> 5.0"
gem "rake", "~> 13.0"
gem "rubocop", "~> 1.21"
`;
    return new GeneratedFile("Gemfile", RelativeFilePath.of("."), gemfileContent);
}

export function generateBinDir(gemName: string): GeneratedFile[] {
    const setupContent = `#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
set -vx

bundle install
`;
    const setup = new GeneratedFile("setup", RelativeFilePath.of("bin"), setupContent);

    const consoleContent = `#!/usr/bin/env ruby
# frozen_string_literal: true

require "bundler/setup"
require "${gemName}"

# You can add fixtures and/or initialization code here to make experimenting
# with your gem easier. You can also use a different console, if you like.

# (If you use this, don't forget to add pry to your Gemfile!)
# require "pry"
# Pry.start

require "irb"
IRB.start(__FILE__)
`;
    const console = new GeneratedFile("setup", RelativeFilePath.of("bin"), consoleContent);

    return [setup, console];
}

export function generateReadme(): GeneratedFile {
    const content = "";
    return new GeneratedFile("README.md", RelativeFilePath.of("."), content);
}