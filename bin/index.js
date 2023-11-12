#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';

class XO {
	boards = [];

	constructor(start = '.........') {
		this.possibilities(start);
	}

	possibilities(board) {
		if (this.exists(board))
			return;
		this.boards.push({ board: board, href: {} });
		if (XO.victory(board))
			return;

		let m = XO.move(board);

		for (let i = 0; i < board.length; i++) {
			if (board.charAt(i) !== ".")
				continue;
			let s = board.slice(0, i) + m + board.slice(i + 1);
			this.possibilities(s);
			this.boards[this.index(board)].href[i] = this.index(s);
		}
	}

	index(board) {
		return this.boards.findIndex(e => e.board === board);
	}

	exists(board) {
		return this.boards.some(e => e.board === board);
	}

	static countEmpty(board) {
		return board.split("").reduce((p, c) => (c === "." ? p + 1 : p), 0);
	}

	static turn(board) {
		return XO.countEmpty(board) + 1;
	}

	static move(board) {
		return (XO.turn(board) + (XO.victory(board) ? 1 : 0)) % 2 === 0 ? "x" : "o";
	}

	static draw(board) {
		return XO.countEmpty(board) === 0;
	}

	static victory(board) {
		let b = board.split("");

		return XO.draw(board) || (
			(b[0] !== "." && b[0] === b[1] && b[0] === b[2]) ||
			(b[3] !== "." && b[3] === b[4] && b[3] === b[5]) ||
			(b[6] !== "." && b[6] === b[7] && b[6] === b[8]) ||
			(b[0] !== "." && b[0] === b[3] && b[0] === b[6]) ||
			(b[1] !== "." && b[1] === b[4] && b[1] === b[7]) ||
			(b[2] !== "." && b[2] === b[5] && b[2] === b[8]) ||
			(b[0] !== "." && b[0] === b[4] && b[0] === b[8]) ||
			(b[3] !== "." && b[2] === b[4] && b[2] === b[5])
		);
	}
}

const PLAYERS = ['RedRedRedRedRedRedRedRedRed', 'Blue'];

function tmpl(board) {
	return `<head><title>Tic Tac Toe</title><link rel="stylesheet" href="main.css"></head><body>${hdr(board.board)}${brd(board)}</body>`;
}

function hdr(board) {
	let victory = XO.victory(board),
		draw = XO.draw(board),
		player = PLAYERS[(XO.turn(board) + (victory ? 1 : 0)) % 2],
		m = XO.move(board),
		h = `<div>&nbsp${victory ? (draw ? "It's a draw!" : `<s ${m}>${player}</s>&nbspwon!`) + again() : `<s ${m}>${player}</s>'s turn&nbsp`}</div>`;

	return `${h}`;
}

function brd(b) {
	return b.board.split('').reduce((p, m, i) =>
		p + (m === 'x' ? x() :
			(m === 'o' ? o() :
				(m === '.' ? (XO.victory(b.board) ? '<span></span>' : a(b.href[i]))
					: ''
				)
			)
		), '');
}

function x() {
	return '<span x></span>'
}

function o() {
	return '<span o></span>'
}

function a(href) {
	return `<a href="./${href}.html"></a>`;
}

function again() {
	return `&nbsp<a href="./0.html"a>Again?</a>`;
}

function tic_tac_toe() {
	const dir = path.join(os.tmpdir(), 'gamifier-tic-tac-toe');
	const linkPath = path.normalize(path.join(process.cwd(), 'tic-tac-toe'));
	const css = "html{height:100%;display:flex;flex-direction:column;justify-content:center}body{width:86vmin;height:98vmin;margin:auto;padding:1vmin;background-color:#eee;font:bold 8vmin Verdana,Tahoma,sans-serif;display:grid;grid-template:2fr repeat(3,5fr)/repeat(3,1fr);gap:1vmin}body *{text-decoration:none}body>*{border:1vmin #000 solid}body>div{grid-column-start:1;grid-column-end:4;width:84vmin;text-align:center;font-size:5vmin;white-space:nowrap;line-height:9.5vmin;display:flex;justify-content:center;align-items:center}div,span{user-select:none}a,span{color:#000;display:flex;justify-content:center;align-items:center;background-color:#f8f8f8}a:hover{background-color:#32cd32}a[a]{background-color:#000;display:initial;color:#f8f8f8;padding:0 2vmin}a[a]:hover{background-color:#32cd32}span::before{width:80%;height:80%}span[x]::before{content:url(\"data:image/svg+xml,%3Csvg version='1.1' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m97.725 2.2758a7.7703 7.7703 0 0 0-10.988 5e-7l-36.737 36.737-36.737-36.737a7.7703 7.7703 0 0 0-10.988-5e-7 7.7703 7.7703 0 0 0 6e-7 10.988l36.737 36.737-36.737 36.737a7.7703 7.7703 0 0 0 7e-7 10.988 7.7703 7.7703 0 0 0 10.988 1e-6l36.737-36.737 36.737 36.737a7.7703 7.7703 0 0 0 10.988-1e-6 7.7703 7.7703 0 0 0 1e-6 -10.988l-36.737-36.737 36.737-36.737a7.7703 7.7703 0 0 0 1e-6 -10.988z' fill='%23f21' fill-rule='evenodd'/%3E%3C/svg%3E%0A\")}span[o]::before{content:url(\"data:image/svg+xml,%3Csvg version='1.1' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m50 0a50 50 0 0 0-50 50 50 50 0 0 0 50 50 50 50 0 0 0 50-50 50 50 0 0 0-50-50zm0 15a35.001 35.001 0 0 1 35.001 35.001 35.001 35.001 0 0 1-35.001 35.001 35.001 35.001 0 0 1-35.001-35.001 35.001 35.001 0 0 1 35.001-35.001z' fill='%2312f' fill-rule='evenodd'/%3E%3C/svg%3E%0A\")}s{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}[x]{color:#f21}[o]{color:#12f}";
	const boards = new XO().boards;

	if (fs.existsSync(dir))
		fs.rmSync(dir, { recursive: true });

	fs.mkdirSync(dir);
	fs.writeFileSync(path.join(dir, 'main.css'), css);

	boards.forEach((b, i) => {
		fs.writeFileSync(path.join(dir, `${i}.html`), tmpl(b));
	});

	if (fs.existsSync(linkPath))
		fs.rmSync(linkPath);
	fs.symlinkSync(path.join(dir, '0.html'), linkPath);
	console.log('Tic-Tac-Toe game generated. Open the tic-tac-toe to play!');
}

if (process.argv.slice(2)[0] === 'tic-tac-toe')
	tic_tac_toe();
else
	console.log('Usage: npx gamifier <game>');