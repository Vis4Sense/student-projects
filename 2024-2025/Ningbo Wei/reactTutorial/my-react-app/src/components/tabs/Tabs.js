import styles from './Tabs.module.css';

const Tabs = ({ tabs }) => {
    return (
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <div key={tab.id || index} className={styles.tab}>
            <h3>{tab.title}</h3>
            <p>{tab.main_text.slice(0, 150)}...</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default Tabs;