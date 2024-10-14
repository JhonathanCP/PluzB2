import pandas as pd
from sqlalchemy import create_engine, text
from datetime import datetime
import io

# Configura la conexión a la base de datos PostgreSQL
DATABASE_URI = 'postgresql://root:root@localhost:5432/BuyerProfile'

# Crear un motor de conexión a la base de datos
engine = create_engine(DATABASE_URI)

# Obtener la hora actual para 'createdAt' y 'updatedAt', ajustada a la zona horaria UTC
current_timestamp = datetime.now()

# Función para convertir los tipos de datos del DataFrame a 'object' (tipos nativos de Python)
def convert_to_object(df):
    return df.astype(object)  # Convertir todo a object para evitar numpy types

# Función para leer el archivo de la tabla `new_data` desde la base de datos
def get_excel_from_db():
    try:
        with engine.connect() as connection:
            # Obtener el archivo .xlsx desde la tabla `new_data`
            result = connection.execute(text("SELECT data FROM new_data ORDER BY id DESC LIMIT 1"))
            blob_data = result.fetchone()[0]  # Obtener el blob del archivo Excel
            excel_file = io.BytesIO(blob_data)  # Convertir el blob a un archivo en memoria (BytesIO)
            return excel_file
    except Exception as e:
        print(f"Error al leer el archivo de la base de datos: {str(e)}")
        return None

# Definir una función para insertar o actualizar los datos de cada tabla
def upsert_data_to_db(df, table_name):
    # Convertir los tipos de datos explícitamente a object (tipos nativos de Python)
    df = convert_to_object(df)

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
        with engine.connect() as connection:
            for index, row in df.iterrows():
                # Convertir la fila a un diccionario con todos los valores como string (para evitar problemas con objetos complejos)
                data = {col: str(val) if isinstance(val, dict) or isinstance(val, object) else val for col, val in row.to_dict().items()}

                # Si se tiene el id, hacer un UPSERT (insertar o actualizar)
                if ids is not None:
                    insert_query = text(f"""
                    INSERT INTO "{table_name}" (id, {', '.join(f'"{col}"' for col in row.index)})
                    VALUES (:id, {', '.join(f':{col}' for col in row.index)})
                    ON CONFLICT (id) DO UPDATE SET {', '.join([f'"{col}" = EXCLUDED."{col}"' for col in row.index])};
                    """)
                    data['id'] = ids[index]  # Asegurar que el id esté en el diccionario
                else:
                    insert_query = text(f"""
                    INSERT INTO "{table_name}" ({', '.join(f'"{col}"' for col in row.index)})
                    VALUES ({', '.join(f':{col}' for col in row.index)});
                    """)

                # Ejecutar la consulta con la parametrización
                connection.execute(insert_query, **data)

        print(f"Datos insertados o actualizados correctamente en la tabla {table_name}")
    except Exception as e:
        print(f"Error al insertar o actualizar en la tabla {table_name}: {str(e)}")

# Obtener el archivo Excel desde la base de datos
excel_file = get_excel_from_db()

if excel_file is not None:
    # Cargar todas las hojas del archivo Excel
    excel_file = pd.ExcelFile(excel_file)

    # Iterar sobre cada hoja y cargar los datos
    for sheet_name in excel_file.sheet_names:
        # Leer la hoja en un DataFrame sin modificar el nombre de las columnas
        df = pd.read_excel(excel_file, sheet_name=sheet_name)

        # Llamar a la función de inserción/actualización para cada tabla
        upsert_data_to_db(df, sheet_name)

    print("Carga masiva completada.")
else:
    print("Error: no se pudo obtener el archivo de la base de datos.")
