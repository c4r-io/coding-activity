import React from 'react';

// Core Myst Parser
import { VFile } from 'vfile';
import { mystParse } from 'myst-parser';

// Frontmatter rendering
import { validatePageFrontmatter } from 'myst-frontmatter';
import { FrontmatterBlock } from '@myst-theme/frontmatter';

// Transformations
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import {
    mathPlugin,
    footnotesPlugin,
    keysPlugin,
    basicTransformationsPlugin,
    enumerateTargetsPlugin,
    resolveReferencesPlugin,
    WikiTransformer,
    GithubTransformer,
    DOITransformer,
    RRIDTransformer,
    linksPlugin,
    ReferenceState,
    getFrontmatter,
    glossaryPlugin,
    abbreviationPlugin,
    joinGatesPlugin
} from 'myst-transforms';

// Article renders
import { ReferencesProvider, ThemeProvider, Theme } from '@myst-theme/providers';

import { MyST, DEFAULT_RENDERERS } from 'myst-to-react';
import { cardDirective } from 'myst-ext-card';

import { gridDirective } from 'myst-ext-grid';
import { tabDirectives } from 'myst-ext-tabs';
import { proofDirective } from 'myst-ext-proof';
import { exerciseDirectives } from 'myst-ext-exercise';

// vfile myst-parser myst-frontmatter @myst-theme/frontmatter @myst-theme/providers unified unist-util-visit myst-transforms myst-to-react myst-ext-card
// myst-ext-grid myst-ext-tabs myst-ext-proof myst-ext-exercise

// Styling to the default Myst look (Borrowed from the Myst Sandbox)
// import './MystPreview.css';

// Create a new component called MystPreview that takes a value prop and keeps it in state.
function MystPreview(props) {
    const [astNodes, setAstNodes] = React.useState(props.value);
    const [frontmatter, setFrontmatter] = React.useState();
    const [references_output, setReferences] = React.useState();


    const MYST_THEME = Theme.light;
    const linkTransforms = [
        new WikiTransformer(),
        new GithubTransformer(),
        new DOITransformer(),
        new RRIDTransformer(),
    ];

    // This function is called whenever the value prop changes.
    React.useEffect(() => {

        const file = new VFile();
        const mdast = mystParse(props.value, {
            markdownit: {
                linkify: true,
            },
            directives: [
                cardDirective,
                gridDirective,
                ...tabDirectives,
                proofDirective,
                ...exerciseDirectives,],
            // roles: [reactiveRole],
            vfile: file,
            allowDangerousHtml: true,
        });

        const references = {
            cite: { order: [], data: {} },
        };
        const { frontmatter: frontmatterRaw } = getFrontmatter(file, mdast, {
            removeYaml: true,
            removeHeading: false,
        });
        const frontmatter = validatePageFrontmatter(frontmatterRaw, {
            property: 'frontmatter',
            messages: {},
        });

        const state = new ReferenceState({
            numbering: frontmatter.numbering ?? FrontmatterBlock?.numbering,
            file,
        });

        unified()
            .use(basicTransformationsPlugin)
            .use(mathPlugin, { macros: frontmatter?.math ?? {} }) // This must happen before enumeration, as it can add labels
            .use(glossaryPlugin, { state }) // This should be before the enumerate plugins
            .use(abbreviationPlugin, { abbreviations: frontmatter.abbreviations })
            .use(enumerateTargetsPlugin, { state })
            .use(linksPlugin, { transformers: linkTransforms })
            .use(footnotesPlugin)
            .use(joinGatesPlugin)
            .use(resolveReferencesPlugin, { state })
            .use(keysPlugin)
            .runSync(mdast, file);

        visit(mdast, (n) => delete n.position);

        //setValue(props.value);
        setAstNodes(mdast);
        setFrontmatter(frontmatter)
        setReferences({ ...references, article: mdast })

    }, [props.value]);

    // Return a div with dangerouslySetInnerHTML set to the value.
    return (
        <div className="panel">
            <div className="panel-wrapper">
                <div className="panel">
                    <ThemeProvider renderers={DEFAULT_RENDERERS} theme={MYST_THEME}>
                        <ReferencesProvider references={references_output}>
                            <FrontmatterBlock frontmatter={frontmatter} className='frontmatter'></FrontmatterBlock>
                            <MyST ast={astNodes} />
                        </ReferencesProvider>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );
}

export default MystPreview;