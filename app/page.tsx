import page from './page.module.scss';

export default function Home() {
	return (
		<div className={page.app}>
			<div>
				<a href="/login" className={page.button}>
					Next
				</a>
			</div>
		</div>
	);
}
