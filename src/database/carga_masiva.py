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

# Obtener la hora actual para 'createdAt' y 'updatedAt'
current_timestamp = datetime.now()

# Definir una función para insertar los datos de cada tabla
def insert_data_to_db(df, table_name):
    # Eliminar la columna 'id' si existe, ya que es autogenerada
    if 'id' in df.columns:
        df = df.drop(columns=['id'])
    
    # Agregar las columnas 'createdAt' y 'updatedAt' con la fecha y hora actuales
    df['createdAt'] = current_timestamp
    df['updatedAt'] = current_timestamp

    # Insertar los datos en la tabla correspondiente
    try:
        df.to_sql(table_name, con=engine, if_exists='append', index=False)
        print(f"Datos insertados correctamente en la tabla {table_name}")
    except Exception as e:
        print(f"Error al insertar en la tabla {table_name}: {str(e)}")

# Iterar sobre cada hoja y cargar los datos
for sheet_name in excel_file.sheet_names:
    # Leer la hoja en un DataFrame
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    # Convertir columnas a lowercase para mantener consistencia con la base de datos
    df.columns = [col for col in df.columns]
    
    # Llamar a la función de inserción para cada tabla
    insert_data_to_db(df, sheet_name)

print("Carga masiva completada.")
