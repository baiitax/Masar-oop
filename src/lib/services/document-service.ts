// MASAR Document Service
import { supabase } from '@/lib/supabase/client';

class DocumentService {
  async getDocuments(transactionId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('transaction_id', transactionId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getDocument(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*, versions:document_versions(*), verifications:document_verifications(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async uploadDocument(transactionId: string, documentType: string, file: File) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    const filePath = `${transactionId}/${documentType}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('compliance-documents')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        transaction_id: transactionId,
        organization_id: '', // Will be set by RLS
        document_type: documentType,
        file_name: file.name,
        storage_path: filePath,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
        status: 'uploaded',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getDocumentUrl(storagePath: string) {
    const { data, error } = await supabase.storage
      .from('compliance-documents')
      .createSignedUrl(storagePath, 3600);
    if (error) throw error;
    return data.signedUrl;
  }
}

export const documentService = new DocumentService();
export default documentService;
