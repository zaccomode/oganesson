# Oganesson

_Oganesson_ is the latest generation of my ([Isaac Shea's](https://github.com/zaccomode)) design systems. It aims to build upon everything that made [Valence](https://valence.isaacshea.com) incredible and improving on everything that didn't work so well.

Oganesson is two things: the specification for the primitives and UX patterns that I use to design my applications, and a suite of language- and framework-specific implementations of that system wherever I need it.

The core design specification is housed in `/design`. This contains everything from how buttons and inputs should look and feel, to the colours Oganesson ships for use, to usage guidelines when designing using Oganesson. This specification is the golden standard: it documents everything, and all implementations must follow it _exactly_.

Implementation is handled by autonomous developer agents, which use the specification as their source of truth. The intention is that spinning up a version of Oganesson in a new framework or language should be as simple as instructing an agent to do so, and the goal is to have a performant beautiful design system wherever and however you need it.

> Oganesson is not yet comprehensive and new features and component requests are welcome. Please open a ticket on this repo to request a feature.

## Svelte (`/svelte`)

`oganesson-svelte` is the first implementation of Oganesson, built upon [Bits UI](https://www.bits-ui.com) and designed to be the most performant strand of Oganesson for Web applications.
