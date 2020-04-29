// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// This should extend markedjs's Tokenizer, but this is not available from @types yet.

var rules = {
    inlinelatex: /^\$([^\$\n]+)\$/,
    // Display LaTeX should start on its own line
    displaylatex: /^ {0,3}\$\$([^\$]*)\$\$/,
    // That's the default text rule from markedjs, but also stopping at $.
    // Note: marked supports escaping $ natively, so no need to do that.
    text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*\$]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/,
    paragraph: null,
};

export const tokenizer = {

    codespan(src: string) {
        const match = rules.inlinelatex.exec(src);
        if (match) {
            return {
                type: 'codespan',
                raw: match[0],
                text: "latex " + match[1].trim()
            };
        }
        return false;
    },

    code(src: string) {
        if (src.match ("ATEST"))
            console.log ("cx:" + src);
        const match = rules.displaylatex.exec(src);
        if (match) {
            return {
                type: 'code',
                raw: match[0],
                lang: 'latex',
                text: match[1].trim()
            };
        }
        return false;
    },

    // Modify the paragraph rule to also stop at latex blocks
    paragraph (src) {
        if (!rules.paragraph) {
            var regex = this.rules.block.paragraph.source;
            var val = rules.displaylatex.source;
            val = val.replace (/(^|[^\[])\^/g, '$1');
            regex = regex.replace ('?!', '?!' + val + '|');
            rules.paragraph = new RegExp (regex);
            this.rules.block.paragraph = rules.paragraph;
        }
        return false;
    },

    // This calls the original inlineText, but using our rule.
    inlineText(src, inRawBlock, smartypants) {
        this.rules.inline.text = rules.text;
        return false;
    },
};
