import React, { useState } from "react";

import { Container, Row, Col, FormControl } from "react-bootstrap";

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
                <Col style={{ overflowY: "scroll" }}>{/* TODO */}</Col>
            </Row>
        </Container>
    );
};
