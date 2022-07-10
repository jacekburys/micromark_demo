import React, { useState, useMemo } from "react";

import { Container, Row, Col, FormControl } from "react-bootstrap";
import JSONPretty from "react-json-pretty";

import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import { Node } from "unist";

import { gfmStrikethrough } from "micromark-extension-gfm-strikethrough";
import { gfmStrikethroughFromMarkdown } from "mdast-util-gfm-strikethrough";

interface Props {}

export const Home = ({}: Props) => {
    const [content, setContent] = useState<string>(
        "*bold* and _italic_ and ~strikethrough~  \n" +
            "**normal** and __normal__  \n" +
            "\n" +
            "this should be a diff D123456  \n" +
            "\n" +
            "this should be a mention @{Jacek}  \n" +
            "\n" +
            "```\n" +
            "this is a code block\n" +
            "```\n" +
            "this should be a link [google](https://www.google.com)  \n" +
            "\n"
    );

    const mdast = useMemo(
        () =>
            fromMarkdown(content, {
                extensions: [gfmStrikethrough()],
                mdastExtensions: [gfmStrikethroughFromMarkdown],
            }),
        [content]
    );

    const ranges = useMemo(() => {
        const res: any[] = [];

        visit(mdast, (node: Node) => {
            switch (node.type) {
                case "delete":
                    res.push({
                        type: "strikethrough",
                        position: node.position,
                    });
            }
        });

        return res;
    }, [mdast]);

    return (
        <Container>
            <Row>
                <Col style={{ minHeight: "99vh" }}>
                    <FormControl
                        as={"textarea"}
                        className={"h-100 py-3 border-0"}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></FormControl>
                </Col>
                <Col style={{ overflowY: "scroll" }}>
                    <JSONPretty data={mdast} />
                </Col>
                <Col style={{ overflowY: "scroll" }}>
                    <JSONPretty data={ranges} />
                </Col>
            </Row>
        </Container>
    );
};
