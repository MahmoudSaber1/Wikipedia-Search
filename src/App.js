import axios from "axios";
import { useEffect, useState } from "react";
import termRefState from "./hooks/useRefState";

export default function App() {
	const [term, setTerm] = useState("javascript");
	const [result, setResult] = useState([]);
	const termRef = termRefState(term);

	useEffect(() => {
		const searcher = async () => {
			const respond = await axios.get(
				"https://en.wikipedia.org/w/api.php",
				{
					params: {
						action: "query",
						list: "search",
						origin: "*",
						format: "json",
						srsearch: term
					}
				}
			);
			setResult(respond.data.query.search);
		};

		if (!result.length) {
			if (term) {
				searcher();
			}
		} else if (termRef !== term) {
			const debounceSearch = setTimeout(() => {
				if (term) {
					searcher();
				}
			}, 1000);

			return () => {
				clearTimeout(debounceSearch);
			};
		}
	}, [term, result.length, termRef]);

	const forEachResult = result.map((el) => {
		return (
			<tr key={el.pageid}>
				<th scope="row">{el.pageid}</th>
				<td>{el.title}</td>
				<td>
					<span dangerouslySetInnerHTML={{ __html: el.snippet }} />
				</td>
			</tr>
		);
	});

	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<div className="mb-3 mt-5">
						<label htmlFor="search" className="form-label">
							Search Now
						</label>
						<input
							type="text"
							className="form-control"
							id="search"
							placeholder="Search From Wikipedia"
							onChange={(e) => setTerm(e.target.value)}
							value={term}
						/>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<table className="table table-bordered table-dark table-hover">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">Title</th>
								<th scope="col">Describtion</th>
							</tr>
						</thead>
						<tbody>{forEachResult}</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
