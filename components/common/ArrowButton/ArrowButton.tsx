import styles from './styles.module.scss';

export default function ArrowButton({ onClick }: { onClick: () => void }) {
	return <button onClick={onClick} className={styles.button} />;
}
