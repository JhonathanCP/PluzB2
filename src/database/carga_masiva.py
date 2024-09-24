import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime

# Configura la conexión a la base de datos PostgreSQL
DATABASE_URI = 'postgresql://root:root@localhost:5432/BuyerProfile'

# Crear un motor de conexión a la base de datos
engine = create_engine(DATABASE_URI)

# Cargar archivo Excel con pandas
file_path = 'src/database/carga_masiva.xlsx'

# Cargar todas las hojas del archivo Excel
excel_file = pd.ExcelFile(file_path)

# Obtener la hora actual para 'createdAt' y 'updatedAt', ajustada a la zona horaria UTC
current_timestamp = datetime.now()

# Definir una función para insertar o actualizar los datos de cada tabla
def upsert_data_to_db(df, table_name):
    # Eliminar la columna 'id' si existe, ya que es autogenerada
    if 'id' in df.columns:
        ids = df['id'].values  # Guardar el valor de los ids para usarlos en el conflicto
        df = df.drop(columns=['id'])
    else:
        ids = None
    
    # Asegurarse de que los campos 'createdAt' y 'updatedAt' tienen el formato correcto
    df['createdAt'] = current_timestamp
    df['updatedAt'] = current_timestamp

    # Insertar o actualizar los datos en la base de datos
    try:
        for index, row in df.iterrows():
            columns = ', '.join(f'"{col}"' for col in row.index)  # Colocar los nombres de columnas entre comillas dobles
            # Asegurarse de que los valores datetime se inserten como cadenas
            values = ', '.join(f"'{x}'" if isinstance(x, (str, datetime)) else str(x) for x in row.values)
            
            # Si se tiene el id, hacer un UPSERT (insertar o actualizar)
            if ids is not None:
                insert_query = f"""
                INSERT INTO "{table_name}" (id, {columns})
                VALUES ({ids[index]}, {values})
                ON CONFLICT (id) DO UPDATE SET {', '.join([f'"{col}" = EXCLUDED."{col}"' for col in row.index])};
                """
            else:
                insert_query = f"""
                INSERT INTO "{table_name}" ({columns})
                VALUES ({values});
                """
            # Ejecutar la consulta
            with engine.connect() as connection:
                connection.execute(insert_query)

        print(f"Datos insertados o actualizados correctamente en la tabla {table_name}")
    except Exception as e:
        print(f"Error al insertar o actualizar en la tabla {table_name}: {str(e)}")

# Iterar sobre cada hoja y cargar los datos
for sheet_name in excel_file.sheet_names:
    # Leer la hoja en un DataFrame sin modificar el nombre de las columnas
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    # Llamar a la función de inserción/actualización para cada tabla
    upsert_data_to_db(df, sheet_name)

print("Carga masiva completada.")
