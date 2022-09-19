import { Extension, Construct, Tokenizer, State } from "micromark-util-types";
import { codes } from "micromark-util-symbol/codes.js";

import {
    Extension as FromMarkdownExtension,
    Handle as FromMarkdownHandle,
} from "mdast-util-from-markdown";

const CODE_CR = -5;
const CODE_LF = -4;
const CODE_CRLF = -3;

const QUOTE_LINE = "quoteLine";
const QUOTE_LINE_PREFIX = "quoteLinePrefix";
const QUOTE_LINE_CONTENT = "quoteLineContent";

const quoteLineTokenize: Tokenizer = (effects, ok, nok) => {
    const start: State = (code) => {
        effects.enter(QUOTE_LINE);
        effects.enter(QUOTE_LINE_PREFIX);
        effects.consume(code);
        effects.exit(QUOTE_LINE_PREFIX);
        effects.enter(QUOTE_LINE_CONTENT, { contentType: "string" });
        return begin;
    };

    const begin: State = (code) => {
        if (
            code != null &&
            code !== CODE_CR &&
            code !== CODE_LF &&
            code !== CODE_CRLF
        ) {
            return insiteContent(code);
        }
        return nok(code);
    };

    const insiteContent: State = (code) => {
        if (
            code == null ||
            code === CODE_CR ||
            code === CODE_LF ||
            code === CODE_CRLF
        ) {
            effects.exit(QUOTE_LINE_CONTENT);
            effects.exit(QUOTE_LINE);
            return ok(code);
        }

        if (code != null) {
            effects.consume(code);
            return insiteContent;
        }

        return nok(code);
    };

    return start;
};

const quoteLineConstruct: Construct = {
    name: "quoteLine",
    tokenize: quoteLineTokenize,
};

const quoteLineExtension: Extension = {
    flowInitial: {
        [codes.greaterThan]: quoteLineConstruct,
    },
};

// ---------------------------------------------------------------------------

const enterQuoteLine: FromMarkdownHandle = function (this, token) {
    this.buffer();
};

const exitQuoteLine: FromMarkdownHandle = function (this, token) {
    const content = this.resume();
    this.enter(
        {
            type: "blockquote",
            children: [
                {
                    type: "paragraph",
                    children: [{ type: "text", value: content }],
                },
            ],
        },
        token
    );
    this.exit(token);
};

const quoteLineFromMarkdownExtension: FromMarkdownExtension = {
    enter: {
        [QUOTE_LINE]: enterQuoteLine,
    },
    exit: {
        [QUOTE_LINE]: exitQuoteLine,
    },
};

// ---------------------------------------------------------------------------

export { quoteLineExtension, quoteLineFromMarkdownExtension };
