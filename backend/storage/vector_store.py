from langchain_chroma import Chroma

from config import VECTORSTORE_DIR


COLLECTION_NAME = (
    "ip_sakti_documents"
)


def get_vector_store(
    embedding_function
):

    return Chroma(

        collection_name=
            COLLECTION_NAME,

        embedding_function=
            embedding_function,

        persist_directory=
            str(VECTORSTORE_DIR)
    )