import { visit } from "unist-util-visit";

const find = /[\t ]*(?:\r?\n|\r)/g;

export default function remarkBreaks() {
    return (tree: any) => {
        visit(tree, "text", (node, index, parent) => {
            const result = [];
            let start = 0;

            find.lastIndex = 0;

            let match = find.exec(node.value);

            while (match) {
                const position = match.index;

                if (start !== position) {
                    result.push({
                        type: "text",
                        value: node.value.slice(start, position),
                    });
                }

                result.push({ type: "break" });
                start = position + match[0].length;
                match = find.exec(node.value);
            }

            if (result.length > 0 && parent && typeof index === "number") {
                if (start < node.value.length) {
                    result.push({
                        type: "text",
                        value: node.value.slice(start),
                    });
                }

                parent.children.splice(index, 1, ...result);
                return index + result.length;
            }
        });
    };
}
