<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Fieldset, Form, Textarea } from '$components';
</script>

<Form class="flex-grow max-w-none" use={[enhance]}>
  <Fieldset class="flex-grow" legend="JDE Rows">
    <Textarea class="flex-grow" name="das" />
  </Fieldset>
  <Button class="self-end" type="submit">Upload</Button>
</Form>
