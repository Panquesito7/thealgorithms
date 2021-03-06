import React, { useEffect } from "react";
import { Typography, Breadcrumbs } from "@material-ui/core";
import Link from "components/link";
import renderMarkdown from "lib/markdown";
import renderNotebook from "lib/notebookjs";
import type { Algorithm, Language } from "lib/models";
import {
  getAlgorithmSlugs,
  getAlgorithm,
  getAlgorithmCode,
} from "lib/algorithms";
import { normalize } from "lib/normalize";
import CodePreview from "components/codePreview";
import Head from "components/head";
import classes from "./algorithm.module.css";

export default function AlgorithmPage({
  algorithm,
  code,
  body,
  jupyter,
}: {
  algorithm: Algorithm;
  code: { [language in Language]?: string };
  body?: string;
  jupyter?: string;
}) {
  useEffect(() => {
    if (jupyter) {
      import("katex/dist/katex.min.js");
      // import("katex/dist/katex.min.css");
      import("katex/contrib/auto-render/auto-render");
    }
  }, [jupyter]);

  return (
    <div className="section container">
      <Head title={algorithm.name} />
      <CodePreview code={code} implementations={algorithm.implementations} />
      <Breadcrumbs className={classes.categories}>
        {algorithm.categories.map((category) => (
          <Typography key={category} variant="h6">
            <Link href={`/category/${normalize(category)}`}>{category}</Link>
          </Typography>
        ))}
      </Breadcrumbs>
      <Typography variant="h4">{algorithm.name}</Typography>
      {jupyter && (
        <div
          className={classes.notebook}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jupyter }}
        />
      )}
      {body && (
        <>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </>
      )}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const algorithm = getAlgorithm(params.algorithm);
  const code = await getAlgorithmCode(algorithm);
  const body = algorithm.body ? await renderMarkdown(algorithm.body) : "";
  const jupyter = algorithm.implementations.jupyter
    ? await renderNotebook(algorithm)
    : "";
  return {
    props: {
      algorithm,
      code,
      body,
      jupyter,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAlgorithmSlugs();
  return {
    paths,
    fallback: false,
  };
}
