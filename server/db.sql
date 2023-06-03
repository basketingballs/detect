--- important : work with this database 

-- execute this first
CREATE DATABASE detect;
-- then this
\c detect;
-- then finally all this
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  phone TEXT,
  pw_hash TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK(account_type IN ('sysadmin','doctor','lab'))
);

ALTER TABLE account
ADD CONSTRAINT email_format_check
CHECK (email ~ $$[A-Za-z0-9.+-]+@[a-z]+\.[A-Za-z]{3}$$),
ADD CONSTRAINT phone_format_check
CHECK (phone ~ $$\+213[5-7][0-9]{8}$$);

CREATE UNIQUE INDEX unique_email ON account (email);
CREATE UNIQUE INDEX unique_phone ON account (phone);

CREATE TABLE person (
    id int PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birthdate DATE NOT NULL,
    is_male BOOLEAN NOT NULL,
    created_date DATE DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE status (
    status_id SERIAL PRIMARY KEY,
    status_text TEXT NOT NULL
);

INSERT INTO status (status_text) VALUES ('active'), ('inactive'),('draft'),('done');

CREATE TABLE sys_admin (
    admin_id SERIAL PRIMARY KEY,
    person_id INT NOT NULL,
    account_id INT NOT NULL,
    status INT REFERENCES status(status_id) NOT NULL CHECK (status IN (1,2)) DEFAULT 1,
    level INT CHECK (level IN (1, 2, 3)) NOT NULL,
    created_by INT,
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES sys_admin(admin_id)
);

CREATE UNIQUE INDEX unique_account ON sys_admin (account_id);
CREATE UNIQUE INDEX unique_person ON sys_admin (person_id);
CREATE UNIQUE INDEX unique_created_by_null ON sys_admin (created_by) WHERE created_by IS NULL;

CREATE TABLE speciality (
    speciality_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO speciality (name) VALUES ('oncology'), ('cancer');

CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    person_id INT NOT NULL,
    account_id INT NOT NULL,
    status INT REFERENCES status(status_id) NOT NULL CHECK (status IN (1,2)) DEFAULT 2,
    speciality INT REFERENCES speciality(speciality_id) NOT NULL,
    created_by INT  NOT NULL,
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES sys_admin(admin_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX unique_account_doctor ON doctor (account_id);
CREATE UNIQUE INDEX unique_person_doctor ON doctor (person_id);


CREATE FUNCTION delete_parents()
  RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM account WHERE account_id = OLD.account_id;
  DELETE FROM person WHERE id = OLD.person_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_parents_sys_admin
  AFTER DELETE ON sys_admin
  FOR EACH ROW
  EXECUTE FUNCTION delete_parents();


CREATE TRIGGER delete_parents_doctor
  AFTER DELETE ON doctor
  FOR EACH ROW
  EXECUTE FUNCTION delete_parents();


CREATE FUNCTION check_account_references()
  RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM doctor WHERE account_id = NEW.account_id
    UNION ALL
    SELECT 1 FROM sys_admin WHERE account_id = NEW.account_id
  ) THEN
    RAISE EXCEPTION 'The inserted account value is already in use';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_sys_admin_account_references
  BEFORE INSERT ON sys_admin
  FOR EACH ROW
  EXECUTE FUNCTION check_account_references();

CREATE TRIGGER check_doctor_account_references
  BEFORE INSERT ON doctor
  FOR EACH ROW
  EXECUTE FUNCTION check_account_references();

CREATE FUNCTION check_person_references()
  RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM doctor WHERE person_id = NEW.person_id
    UNION ALL
    SELECT 1 FROM sys_admin WHERE person_id = NEW.person_id
  ) THEN
    RAISE EXCEPTION 'The inserted account value is already in use';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_sys_admin_person_references
  BEFORE INSERT ON sys_admin
  FOR EACH ROW
  EXECUTE FUNCTION check_person_references();

CREATE TRIGGER check_doctor_person_references
  BEFORE INSERT ON doctor
  FOR EACH ROW
  EXECUTE FUNCTION check_person_references();


-- Prevent Updating the account reference on all account references
CREATE FUNCTION prevent_update_account() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.account_id <> OLD.account_id THEN
    RAISE EXCEPTION 'The account_id column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- on sys_admin table
CREATE TRIGGER prevent_update_sys_admin_account_trigger
BEFORE UPDATE ON sys_admin
FOR EACH ROW
EXECUTE FUNCTION prevent_update_account();

-- on doctor table
CREATE TRIGGER prevent_update_doctor_account_trigger
BEFORE UPDATE ON doctor
FOR EACH ROW
EXECUTE FUNCTION prevent_update_account();


-- Prevent Updating the person_id reference on all person references
CREATE FUNCTION prevent_update_person() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.person_id <> OLD.person_id THEN
    RAISE EXCEPTION 'The person column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- on sys_admin table
CREATE TRIGGER prevent_update_sys_admin_person_trigger
BEFORE UPDATE ON sys_admin
FOR EACH ROW
EXECUTE FUNCTION prevent_update_person();

-- on doctor table
CREATE TRIGGER prevent_update_doctor_person_trigger
BEFORE UPDATE ON doctor
FOR EACH ROW
EXECUTE FUNCTION prevent_update_person();

CREATE FUNCTION prevent_update_account_type() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.account_type <> OLD.account_type THEN
    RAISE EXCEPTION 'The account_type column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_update_account_type_trigger
BEFORE UPDATE ON account
FOR EACH ROW
EXECUTE FUNCTION prevent_update_account_type();


CREATE TABLE static_location (
    static_location_id SERIAL PRIMARY KEY,
    wilaya TEXT NOT NULL,
    dayra TEXT NOT NULL,
    baladya TEXT NOT NULL,
    neighbourhood TEXT NOT NULL,
    postal_code VARCHAR(20) NOT NULL
);

CREATE TABLE unit (
  unit_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status INT REFERENCES status(status_id) DEFAULT 2 NOT NULL,
  static_location_id INT REFERENCES static_location(static_location_id) ON DELETE CASCADE NOT NULL ,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by INT REFERENCES sys_admin(admin_id) NOT NULL
);

CREATE FUNCTION prevent_update_unit() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.static_location_id <> OLD.static_location_id THEN
    RAISE EXCEPTION 'The person column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- on sys_admin table
CREATE TRIGGER prevent_update_unit_trigger
BEFORE UPDATE ON unit
FOR EACH ROW
EXECUTE FUNCTION prevent_update_unit();

CREATE TABLE campaign (
    campaign_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    status INT REFERENCES status(status_id) DEFAULT 3 NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_by INT REFERENCES sys_admin(admin_id) NOT NULL
);

CREATE TABLE laboratory (
  lab_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  status INT REFERENCES status(status_id) DEFAULT 2 NOT NULL,
  account_id INT REFERENCES account(account_id) NOT NULL,
  static_location_id INT REFERENCES static_location(static_location_id),
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by INT REFERENCES sys_admin(admin_id) NOT NULL
);

CREATE TABLE subject (
  subject_id SERIAL PRIMARY KEY,
  person_id INT REFERENCES person(id) NOT NULL,
  static_location_id INT REFERENCES static_location(static_location_id),
  email TEXT NOT NULL CHECK (email ~ $$[A-Za-z0-9.+-]+@[a-z]+\.[A-Za-z]{3}$$),
  phone TEXT CHECK (phone ~ $$\+213[5-7][0-9]{8}$$),
  created_by INT REFERENCES doctor(doctor_id) NOT NULL
);

CREATE FUNCTION delete_parents_subject()
  RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM person WHERE id = OLD.person_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_parents_subject_trigger
  AFTER DELETE ON subject
  FOR EACH ROW
  EXECUTE FUNCTION delete_parents_subject();


CREATE TABLE test_result (
  test_result_id INT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO test_result (test_result_id,value) VALUES (0,'negative'),(1,'positive'),(2,'undeterminable'),(3,'in proccessing'),(4,'not recieved');

CREATE TABLE subject_tests (
    test_id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES subject(subject_id) ON DELETE CASCADE NOT NULL,
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE NOT NULL,
    unit_id INT REFERENCES unit(unit_id)ON DELETE CASCADE  NOT NULL ,
    lab_id INT REFERENCES laboratory(lab_id)  ON DELETE CASCADE NOT NULL,
    camp_id INT REFERENCES campaign(campaign_id) ON DELETE CASCADE NOT NULL,
    test_result INT CHECK (test_result in (0,1,2,3,4)) REFERENCES test_result(test_result_id),
    doctor_notes TEXT,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE test_data (
    test_data_id SERIAL PRIMARY KEY,
    test_id INT REFERENCES subject_tests(test_id) ON DELETE CASCADE  NOT NULL,
    is_smoker BOOLEAN,
    eat_before_test BOOLEAN
);

CREATE TABLE camp_unit (
    camp_unit_id SERIAL PRIMARY KEY,
    unit_id INT REFERENCES unit(unit_id) ON DELETE CASCADE  NOT NULL,
    camp_id INT REFERENCES campaign(campaign_id) ON DELETE CASCADE  NOT NULL,
    status INT REFERENCES status(status_id) DEFAULT 3 NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE
);


CREATE TABLE unit_lab (
    unit_lab_id SERIAL PRIMARY KEY,
    camp_unit_id INT REFERENCES camp_unit(camp_unit_id) NOT NULL,
    lab_id INT REFERENCES laboratory(lab_id) ON DELETE CASCADE  NOT NULL,
    status INT REFERENCES status(status_id) DEFAULT 3 NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE unit_doc (
    unit_doc_id SERIAL PRIMARY KEY,
    camp_unit_id INT REFERENCES camp_unit(camp_unit_id) NOT NULL,
    doctor_id INT REFERENCES doctor(doctor_id) ON DELETE CASCADE  NOT NULL,
    status INT REFERENCES status(status_id) DEFAULT 3 NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE
);

CREATE TABLE temp_email_confirmation (
    email TEXT PRIMARY KEY,
    code TEXT,
    count INT DEFAULT 0
);

CREATE FUNCTION check_done_status()
  RETURNS TRIGGER AS $$
BEGIN
  IF  OLD.status = '4'
  AND
  OLD.status <> NEW.status
   
  THEN
    RAISE EXCEPTION 'cannot revert what is marked as done';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_done_status_camp
BEFORE INSERT ON campaign
FOR EACH ROW
EXECUTE FUNCTION check_done_status();

CREATE TRIGGER check_done_status_unit_doc
BEFORE INSERT ON unit_doc
FOR EACH ROW
EXECUTE FUNCTION check_done_status();

CREATE TRIGGER check_done_status_unit_lab
BEFORE INSERT ON unit_lab
FOR EACH ROW
EXECUTE FUNCTION check_done_status();

CREATE TRIGGER check_done_status_unit_camp
BEFORE INSERT ON camp_unit
FOR EACH ROW
EXECUTE FUNCTION check_done_status();

CREATE FUNCTION check_unit_camp()
  RETURNS TRIGGER AS $$
BEGIN
  IF  
  NEW.status = 1
  AND
  EXISTS (
    SELECT 1 FROM camp_unit WHERE status = 1 AND unit_id = NEW.unit_id
    )
   
  THEN
    UPDATE camp_unit SET status = 4 WHERE status =1 AND unit_id = NEW.unit_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_unit_camp_trigger
BEFORE INSERT ON camp_unit
FOR EACH ROW
EXECUTE FUNCTION check_unit_camp();

CREATE FUNCTION set_unit_status()
  RETURNS TRIGGER AS $$
BEGIN
  IF  NEW.status = 4 AND NEW.status <> OLD.status
  THEN
    UPDATE unit_doc SET status = 4 WHERE camp_unit_id = NEW.camp_unit_id;
    UPDATE unit_lab SET status = 4 WHERE camp_unit_id = NEW.camp_unit_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_unit_status_trigger
AFTER UPDATE ON camp_unit
FOR EACH ROW
EXECUTE FUNCTION set_unit_status();


CREATE FUNCTION set_end_date()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 4 AND NEW.status <> OLD.status THEN
    NEW.end_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_camp_unit_trigger
BEFORE UPDATE ON camp_unit
FOR EACH ROW
EXECUTE FUNCTION set_end_date();

CREATE TRIGGER set_lab_unit_trigger
BEFORE UPDATE ON unit_lab
FOR EACH ROW
EXECUTE FUNCTION set_end_date();

CREATE TRIGGER set_doc_unit_trigger
BEFORE UPDATE ON unit_doc
FOR EACH ROW
EXECUTE FUNCTION set_end_date();

    -- subject_id ,
    -- doctor_id ,
    -- unit_id,
    -- lab_id ,
    -- camp_id ,
    -- doctor_notes,
    -- test_date