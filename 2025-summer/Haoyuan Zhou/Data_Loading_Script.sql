
\copy cdm.vocabulary FROM '/path/to/your/data/VOCABULARY.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.domain FROM '/path/to/your/data/DOMAIN.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.concept_class FROM '/path/to/your/data/CONCEPT_CLASS.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.relationship FROM '/path/to/your/data/RELATIONSHIP.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.concept FROM '/path/to/your/data/CONCEPT.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.concept_synonym FROM '/path/to/your/data/CONCEPT_SYNONYM.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.concept_ancestor FROM '/path/to/your/data/CONCEPT_ANCESTOR.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.concept_relationship FROM '/path/to/your/data/CONCEPT_RELATIONSHIP.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');


\copy cdm.drug_strength FROM '/path/to/your/data/DRUG_STRENGTH.csv' WITH (FORMAT CSV, HEADER TRUE, DELIMITER E'\t');